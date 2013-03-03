var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

module.exports = function(configuration, callback) {
	if(!callback) {
		callback = configuration;
	}

	var api = function (url, options, callback) {
		var path = options.file;
		fs.writeFile(path, url, function(error) {
			var emitter = new EventEmitter();
			_.extend(emitter, {
				id: path,
				stop: function(callback) {
					callback(null, this);
				},
				status: function(callback) {
					// TODO fs.stat
					callback(null, path);
				}
			});
			callback(error, emitter);
		});
	}

	callback(null, api);
}
