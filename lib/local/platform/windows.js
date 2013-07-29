var exec = require('child_process').exec;
var _ = require('underscore');
var async = require('async');

var supportedBrowsers = exports.supported = [
	{
		name : 'chrome',
		search : 'chrome.exe'
	},
	{
		name : 'firefox',
		search : 'firefox.exe'
	},
	{
		name : 'opera',
		search : 'opera.exe'
	},
	{
		name : 'ie',
		search : 'iexplore.exe'
	},
	{
		name : 'phantom',
		search : 'phantomjs.exe'
	}
];

var options = {
	cwd : 'C:\\'
}

var getVersion = function (browser, callback) {
	var command = __dirname + '\\..\\..\\..\\resources\\ShowVer.exe "' + browser.command + '"';
	exec(command, function (error, stdout) {
		var regex = /ProductVersion:\s*(.*)/;
		// ShowVer.exe returns a non zero status code even if it works so no point in just checking for error
		if (typeof stdout === 'string' && regex.test(stdout)) {
			return callback(null, stdout.match(regex)[1]);
		}

		return callback(error);
	});
};

var cache = null;
exports.getBrowsers = function(callback) {
	if(cache !== null) {
		return callback(null, cache);
	}

	// Searching for all of them at once is a lot faster even though the processing is a little awkward
	var dir = 'dir /s /b ' + supportedBrowsers.map(function (browser) {
		return browser.search;
	}).join(' ');

	exec(dir, options, function (error, stdout) {
		if(error) return callback(error);

		var browsers = {};
		stdout.split('\n').map(function (line) {
			return line.trim();
		}).forEach(function (line) {
			supportedBrowsers.forEach(function (browser) {
				var current = _.extend({}, browser);
				var name = current.name;
				if (!browsers[name] && new RegExp(current.search).test(line)) {
					browsers[name] = function(callback) {
						current.command = line;
						getVersion(current, function(error, version) {
							if(error) callback(error);
							current.version = version;
							callback(null, current);
						});
					}
				}
			});
		});

		async.parallel(_.values(browsers), function(error, results) {
			if(error) return callback(error);
			cache = results;
			callback(null, cache);
		});
	});
}
