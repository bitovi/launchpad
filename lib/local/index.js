var _ = require('underscore');
var instance = require('./instance');
var platforms = {
	win32 : './platform/windows',
	darwin : './platform/macos',
	linux : './platform/unix',
	freebsd : './platform/unix',
	sunos : './platform/unix'
};

var platform = require(platforms[process.platform]);
var normalize = function(browser) {
	return {
		browser : browser.name,
		version : browser.version
	}
}

module.exports = function (settings, callback) {
	if (!callback) {
		callback = settings;
		settings = undefined;
	}

	platform.getBrowsers(function (error, browsers) {
		if (error) {
			callback(error);
		}

		var api = function (url, options, callback) {
			var name = options.browser;
			if (!name) {
				return callback(new Error('You need to set the name of the browser you want to start!'));
			}

			var browser = _.find(browsers, function (current) {
				return (current.name === name) &&
					(!options.version || current.version.indexOf(options.version) === 0);
			});

			if (!browser) {
				var available = _.map(browsers, function (browser) {
					return browser.name;
				});
				return callback(new Error('Can not start ' + name + '. Available browsers: [' + available.join(' ') + ']'));
			}

			var args = browser.args || [];
			args.push(url);
			callback(null, instance.start(browser.command, args, settings, browser), normalize(browser));
		}


		browsers.forEach(function (browser) {
			api[browser.name] = function (url, options, callback) {
				if (!callback) {
					callback = options;
					options = {};
				}
				api(url, _.extend({ browser : browser.name }, options), callback);
			}
		});

		api.browsers = browsers.map(normalize);
		callback(null, api);
	});
}
