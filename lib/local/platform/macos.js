var exec = require('child_process').exec;
var plist = require('plist');
var path = require('path');
var async = require('async');
var _ = require('underscore');
var fs = require('fs');

var supportedBrowsers = exports.supported = [
	{
		name : 'chrome',
		pathQuery : 'mdfind \'kMDItemDisplayName == "Google Chrome" && kMDItemKind == Application\'',
		plistPath : 'Contents/Info.plist',
		command : 'open',
		process : 'Google Chrome',
		versionKey : 'KSVersion',
		defaultLocation : '/Applications/Google Chrome.app'
	},
	{
		name : 'canary',
		pathQuery : 'mdfind \'kMDItemDisplayName == "Google Chrome Canary" && kMDItemKind == Application\'',
		plistPath : 'Contents/Info.plist',
		command : 'open',
		process : 'Google Chrome Canary',
		versionKey : 'KSVersion',
		defaultLocation : '/Applications/Google Chrome Canary.app'
	},
	{
		name : 'firefox',
		pathQuery : 'mdfind \'kMDItemDisplayName == "Firefox" && kMDItemKind == Application\'',
		plistPath : 'Contents/Info.plist',
		command : 'open',
		process : 'firefox',
		versionKey : 'CFBundleGetInfoString',
		defaultLocation : '/Applications/Firefox.app'
	},
	{
		name : 'aurora',
		pathQuery : 'mdfind \'kMDItemDisplayName == "FirefoxAurora" && kMDItemKind == Application\'',
		plistPath : 'Contents/Info.plist',
		command : 'open',
		process : 'firefox',
		versionKey : 'CFBundleGetInfoString',
		defaultLocation : '/Applications/FirefoxAurora.app'
	},
	{
		name : 'opera',
		pathQuery : 'mdfind \'kMDItemDisplayName == "Opera" && kMDItemKind == Application\'',
		plistPath : 'Contents/Info.plist',
		command : 'open',
		process : 'Opera',
		versionKey : 'CFBundleShortVersionString',
		defaultLocation : '/Applications/Opera.app'
	},
	{
		name : 'phantom',
		pathQuery : 'which phantomjs',
		process : 'phantomjs',
		args : [__dirname + '/../../../resources/phantom.js']
	},
	{
		name : 'safari',
		pathQuery : 'mdfind \'kMDItemDisplayName == "Safari" && kMDItemKind == Application\'',
		plistPath : 'Contents/version.plist',
		command : 'open',
		process : 'Safari',
		versionKey : 'CFBundleShortVersionString',
		defaultLocation : '/Applications/Safari.app'
	}
];

// Push a bunch of functions for use with async.parallel that callback with the current browser
var browsers = supportedBrowsers.map(function (browser) {
	return function(callback) {
		var current = _.extend({}, browser);
		exec(current.pathQuery, function (err, stdout) {
			if (err) return callback(err);

			if (!stdout.length) {
				// Not found using mdfind, let's see if the standard path exists
				if(browser.defaultLocation && fs.existsSync(browser.defaultLocation)) {
					return callback(null, browser.defaultLocation);
				}
				return callback(null, null);
			}

			// Set path
			current.path = stdout.split('\n')[0].trim();
			// Set the command to the path
			if (!current.command) {
				current.command = current.path;
			} else {
				// Otherwise set the arguments for the open process
				current.args = ['--wait-apps', '--new', '--fresh', '-a', current.path];
			}

			getVersion(current, function (err, version) {
				current.version = version;
				callback(null, current);
			});
		});
	}
});

/**
 * Gets the version for a given browser object. The `path` property
 * needs to be set. Either reads the version from the browsers plist file
 * or by executing it with the --version flag.
 *
 * @param {Object} browser The browser object
 * @param {Function} callback The callback getting an error or the version
 * number passed.
 */
var getVersion = function (browser, callback) {
	if (browser.plistPath === undefined) {
		exec(browser.path + ' --version', function (err, stdout) {
			callback(err, stdout.split('\n')[0].trim());
		});
	} else {
		var plistInfo = path.join(browser.path, browser.plistPath);
		try {
			var data = plist.parseFileSync(plistInfo);
			callback(null, data[browser.versionKey]);
		}
		catch (e) {
			callback(new Error('Unable to get ' + browser.name + ' version.'));
		}
	}
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
