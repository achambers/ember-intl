/**
* Copyright 2014, Yahoo! Inc.
* Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
*/

import Ember from 'ember';

var FormatBase = Ember.Object.extend({
	filterFormatOptions: function () {
		var match = false;
		var self  = this;

		var options = this.constructor.formatOptions.reduce(function (opts, name) {
			if (self.hasOwnProperty(name)) {
				match = true;
				opts[name] = self[name];
			}

			return opts;
		}, {});

		if (match) {
			return options;
		}
	}
});

FormatBase.reopenClass({
	formatOptions: Ember.A()
});

export default FormatBase;
