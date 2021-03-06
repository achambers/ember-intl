/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import BaseHelper from '../-private/helpers/-format-base';

export default BaseHelper.extend({
  format(value, options) {
    return this.intl.formatTime(value, options);
  },
});
