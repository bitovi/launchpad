// dir /s /b /chrome.exe
// Version number checker
var exec = require('child_process').exec;
var path = require('path');
var Deferred = require('deferred');

var browsers = {
	chrome: {
		command : 'chrome.exe'
	},
	firefox: {
		command : 'firefox.exe'
	},
	opera: {
		command : 'opera.exe'
	},
	ie : {
		command : 'iexplore.exe'
	}
//	phantom: {
//		command : 'phantomjs.bat',
//		process : ''
//	}
};

var paths = null;
var getPath = function(name, callback) {
	if(paths !== null) {
		return paths(function(mappings) {
			callback(null, mappings);
		}, function(error) {
			callback(error);
		});
	}

	var dfd = Deferred();
	// Initialize the browser path cache. Searching for all of them at once is
	// a lot faster even if the processing is more awkward
	var dir = 'dir /s /b';
	Object.keys(browsers).forEach(function(name) {
		dir += ' ' + browsers[name].command;
	});

	// TODO probably make CWD an option
	exec(dir, { cwd : 'C:\\' }, function(error, stdout) {
		if(error) return def.fail(error);

		paths = {};
		stdout.split('\n').forEach(function(line) {
			line = line.trim();
			Object.keys(browsers).forEach(function(current) {
				if(!paths[current] && new RegExp(browsers[current].command).test(line)) {
					paths[current] = line;
				}
			});
		});
		def.resolve()
	});
	paths = dfd.promise;
};

var getCommand = function(name, callback){
	if (!browsers[name]) return callback();

	getPath(name, callback);
};

var getProcessName = function(name){
	if (!browsers[name]) return null;
	return browsers[name].process;
};

var getVersion = function(name, callback) {
	if (!browsers[name]) return callback();
	// TODO
	getPath(name, function(error, path) {
		if(error) return callback(error);
		exec(__dirname + '\\..\\..\\resources/ShowVer.exe ' + path, function(error, stdout) {
			if(error) return callback(error);
			var regex = /ProductVersion:(.*)$/;
		});
	})
};

var getArguments = function(name, callback) {
	// No default args
	callback(null, []);
};

exports.path = getPath;
exports.command = getCommand;
exports.process = getProcessName;
exports.version = getVersion;
exports.args = getArguments;
