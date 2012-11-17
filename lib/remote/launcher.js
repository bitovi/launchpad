var browserstack = require('../browserstack');
var _ = require('underscore');

module.exports = function(configuration, callback) {
	var config = _.pick(configuration, 'username', 'password');
	config.version = 1;
	config.server = {
		host : configuration.host || 'localhost',
		port : configuration.port || 7998
	};
	browserstack(config, callback);
}
