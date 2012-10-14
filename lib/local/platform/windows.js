var exec = require('child_process').exec;
var path = require('path');
var Q = require('q');

var browsers = {
	chrome : {
		command : 'chrome.exe'
	},
	firefox : {
		command : 'firefox.exe'
	},
	opera : {
		command : 'opera.exe'
	},
	ie : {
		command : 'iexplore.exe'
	},
	phantom : {
		command : 'phantomjs.exe'
	}
};

var searchAll = function () {
	var dfd = Q.defer();
	// Searching for all of them at once is a lot faster even though the processing is a little awkward
	var dir = 'dir /s /b';
	Object.keys(browsers).forEach(function (name) {
		dir += ' ' + browsers[name].command;
	});

	console.log('Getting', dir);
	// TODO probably make CWD an option
	exec(dir, { cwd : 'C:\\' }, function (error, stdout) {
		if (error) dfd.reject(new Error(error));

		var currentPaths = {};
		stdout.split('\n').map(function (line) {
			return line.trim();
		}).forEach(function (line) {
				Object.keys(browsers).forEach(function (current) {
					if (!currentPaths[current] && new RegExp(browsers[current].command).test(line)) {
						currentPaths[current] = line;
					}
				});
			});

		dfd.resolve(currentPaths);
	});

	return dfd.promise;
}

var pathDeferred = null;
var getPath = function (name, callback) {
	if (pathDeferred === null) {
		pathDeferred = searchAll();
	}
	pathDeferred.then(function (paths) {
		callback(null, paths[name]);
	}, function (error) {
		callback(error);
	});
};

var getCommand = function (name, callback) {
	if (!browsers[name]) return callback();
	getPath(name, callback);
};

var getProcessName = function (name) {
	if (!browsers[name]) return null;
	return browsers[name].process;
};

var getVersion = function (name, callback) {
	if (!browsers[name]) return callback();
	getPath(name, function (error, path) {
		if (error) return callback(error);

		var command = __dirname + '\\..\\..\\..\\resources\\ShowVer.exe "' + path + '"';
		exec(command, function (error, stdout, stderr) {
			var regex = /ProductVersion:\s*(.*)/;
			// ShowVer.exe returns a non zero status code even if it works
			if(typeof stdout === 'string') {
				return callback(null, stdout.match(regex)[1]);
			}

			return callback(error);
		});
	})
};

var getArguments = function (name, callback) {
	// No default args
	callback(null, []);
};

exports.path = getPath;
exports.command = getCommand;
exports.process = getProcessName;
exports.version = getVersion;
exports.args = getArguments;
