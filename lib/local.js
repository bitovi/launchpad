// A local browser launcher
var browsers = require('./local/' + process.platform);

module.exports = function(settings) {
	var api = {};
	Object.keys(browsers).forEach(function(name) {
		api[name] = function(url, config, callback) {
			if(!callback) {
				callback = config;
			}
			browsers[name](url, settings, callback);
		}
	});
	return api;
}