// Launches browserstack instances
var Proto = require('uberproto'),
	BrowserStack = require( "browserstack" );

module.exports = function(configuration) {
	var client = BrowserStack.createClient({
		username: configuration.username,
		password: configuration.password
	});

	var Instance = Proto.extend({
		init : function(configuration) {
			this._configuration = configuration;
			this._configuration.version = configuration.version || 'latest';
			this.status = 'stopped';
		},

		start : function(callback) {
			var self = this;
			client.createWorker(this._configuration, function(error, worker) {
				if(!error) {
					self.status = worker.status;
					self.id = worker.id;
				} else {
					self.status = 'error';
				}

				callback(error, self);
			});
		},

		stop : function(callback) {
			var self = this;
			this.status = 'stopping';
			client.terminateWorker(this.id, function(error) {
				if(!error) {
					self.status = 'stopped';
				}
				callback(error, self);
			});
		},

		getInfo : function(callback) {

		}
	});

	return {
		client : client,
		Instance : Instance,
		getInstance : function(configuration) {
			return Instance.create(configuration);
		}
	}
}
