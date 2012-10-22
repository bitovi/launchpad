var exec = require('child_process').exec;
var path = require('path');
var _ = require('underscore');

var supportedBrowsers = exports.supported = [
	{
		name : 'chrome',
		pathQuery : 'which google-chrome',
		process : 'chrome'
	},
	{
		name : 'firefox',
		pathQuery : 'which firefox',
		process : 'firefox'
	},
	{
		name : 'opera',
		pathQuery : 'which opera',
		process : 'opera'
	},
	{
		name : 'phantom',
		pathQuery : 'which phantomjs',
		process : 'phantomjs'
	}
];

var browsers = supportedBrowsers.map(function (browser) {
	return function(callback) {
		var current = _.extend({}, browser);
		exec(current.pathQuery, function (err, stdout) {
			if (!stdout.length) {
				return callback(null, null);
			}

			current.command = stdout.trim();
			getVersion(current, function(err, version) {
				if(err) return callback(err);

				current.version = version;
				callback(null, current);
			});
		});
	}
});

var getVersion = function (browser, callback) {
	exec(browser.command + ' --version', function (err, stdout) {
		callback(err, (stdout && stdout.trim()));
	});
};

var cache = null;
exports.getBrowsers = function(callback) {
	if(cache !== null) {
		return callback(null, cache);
	}

	async.parallel(browsers, function(error, list) {
		if(error) return callback(error);
		cache = list.filter(function(browser) {
			return browser !== null;
		});
		callback(null, cache);
	});
}
