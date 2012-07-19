var fs = require('fs'),
	instance = require('./instance'),
	path = process.env.PATH,
	appPath = '/Applications/',
	apps = fs.readdirSync(appPath);

function getApplication(name, executable, callback) {
	// TODO:
	// - also look in PATH
	// - Figure out how to get versions instead of just returning first match
	var len = apps.length,
		regex = new RegExp('.*' + name + '.*', 'i');
	for(var i = 0; i < len; i++) {
		if(apps[i] && apps[i].match(regex) !== null) {
			return fs.realpath(appPath + apps[i] + '/Contents/MacOS/' + executable,
				function(err, path) {
					if(err) {
						return callback(new Error('Could not find ' + executable));
					}
					return callback(null, path);
				});
		}
	}
	return callback(new Error('Could not find ' + executable));
};

function starter(name, executable) {
	return function(url, settings, callback) {
		getApplication(name, executable, function(err, path) {
			if(err) {
				return callback(err);
			}
			instance.start(path, [url], settings || {}, callback);
		});
	}
}


module.exports = {
	firefox : starter('firefox', 'firefox'),
	chrome : starter('chrome', 'Google Chromes'),
	safari : starter('safari', 'Safari'),
	opera : starter('opera', 'Opera')
}
