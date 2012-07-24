// Launches browserstack instances
var BrowserStack = require( "browserstack");
var events = require('events');

module.exports = function(configuration, callback) {
	var client = BrowserStack.createClient(configuration);
	var Instance = function(worker) {
		this.id = worker.id;
		this.worker = worker;
	}

	Instance.prototype = Object.create(events.EventEmitter.prototype);

	Instance.prototype.stop = function (callback) {
		var self = this;
		client.terminateWorker(this.id, function(err, data) {
			if(err) {
				return callback(err);
			}
			self.emit('stop', data);
			return callback(null, data);
		});
	}

	Instance.prototype.status = function(callback) {
		client.getWorker(this.id, callback);
	}

	client.getBrowsers(function(err, browsers) {
		if(err) {
			return callback(err);
		}
		var api = {
			browsers : browsers,
			client : client,
			instance : function(url, settings, callback) {
				if(!callback) {
					callback = settings;
					settings = {};
				}
				settings.url = url;

				client.createWorker(settings, function(err, worker) {
					if(err) {
						return callback(err);
					}
					return callback(null, new Instance(worker));
				});
			}
		};

		['chrome', 'ie', 'firefox', 'opera', 'safari'].forEach(function(name) {
			api[name] = function(url, settings, callback) {
				if(!callback) {
					callback = settings;
					settings = {};
				}
				settings.browser = name;
				settings.version = settings.version || 'latest';
				this.instance(url, settings, callback);
			}
		});

		return callback(null, api);
	});
}
