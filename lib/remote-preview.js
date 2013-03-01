var fs = require('fs');

module.exports = function(configuration, callback) {
	if(!callback) {
		callback = configuration;
	}

	var api = function (url, options, callback) {
		var path = options.file;
		fs.writeFile(path, url, function(error) {
			callback(error, {
				id: path,
				stop: function(callback) {
					callback(null, this);
				},
				status: function(callback) {
					// TODO fs.stat
					callback(null, path);
				}
			});
		});
	}

	callback(null, api);
}
