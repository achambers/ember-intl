const messageParser = require('intl-messageformat-parser');

const pluralCategories = require('./plural-categories');
const ordinalCategories = require('./ordinal-categories');
const traverse = require('./ast-traverse');

const { TYPE } = messageParser;

function validateMessage(message, locale) {
  let ast = messageParser.parse(message);

  locale = locale || '';

  let language = locale.split('-')[0];
  let validPlurals = pluralCategories[language];
  let validOrdinals = ordinalCategories[language];

  traverse(ast, {
    [TYPE.plural]: (node) => {
      const selectors = Object.keys(node.options).map((s) => s.trim());

      if (!selectors.includes('other')) {
        throw new MissingOtherSelectorError();
      }

      if (!locale) {
        return;
      }

      let isOrdinal = node.pluralType === 'ordinal';
      let validSelectors = isOrdinal ? validOrdinals : validPlurals;
      let invalidSelectors = selectors.filter((selector) => {
        return validSelectors.indexOf(selector) === -1 && !/=\d+/.test(selector);
      });

      if (invalidSelectors.length) {
        if (isOrdinal) {
          throw new UnknownOrdinalCategoriesError(invalidSelectors);
        } else {
          throw new UnknownPluralCategoriesError(invalidSelectors);
        }
      }
    },

    [TYPE.select]: (node) => {
      const selectors = Object.keys(node.options).map((s) => s.trim());

      if (!selectors.includes('other')) {
        throw new MissingOtherSelectorError();
      }
    },
  });
}

class UnknownPluralCategoriesError extends Error {
  constructor(categories) {
    super(
      categories.length === 1
        ? `Unknown plural category: ${categories[0]}`
        : `Unknown plural categories: ${categories.join(', ')}`
    );
  }
}

class UnknownOrdinalCategoriesError extends Error {
  constructor(categories) {
    super(
      categories.length === 1
        ? `Unknown ordinal category: ${categories[0]}`
        : `Unknown ordinal categories: ${categories.join(', ')}`
    );
  }
}

class MissingOtherSelectorError extends Error {
  constructor() {
    super('Missing selector: other');
  }
}

module.exports = validateMessage;
