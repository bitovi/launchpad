var spawn = require("child_process").spawn;
var exec = require("child_process").exec;
var EventEmitter = require('events').EventEmitter;

var Instance = function (cmd, args, settings, options) {
	this.options = options || {};
	var self = this;
	var childProcess = spawn(cmd, args, settings || {});

	childProcess.on('exit', function(code, signal) {
		self.emit('stop', {
			code : code,
			signal : signal
		});
	});

	if(settings && settings.timeout) {
		setTimeout(function() {
			self.stop();
		}, settings.timeout * 1000);
	}

	this.stdout = childProcess.stdout;
	this.stderr = childProcess.stderr;
	this.id = childProcess.pid;
	this.process = childProcess;
};

Instance.prototype = new EventEmitter();

Instance.prototype.stop = function (callback) {
	if(callback) {
		this.once('stop', function(data) {
			callback(null, data);
		});
	}

	if(this.options.process && process.platform !== 'win32') {
		spawn('killall', [this.options.process]);
	} else {
		this.process.kill();
	}
};

exports.Instance = Instance;

/**
 * Starts a new process.
 *
 * @param cmd The process command line
 * @param args The process arugments
 * @param settings The process environment settings
 * @param callback function(error, instance) Callback after the instance is started
 * @see http://nodejs.org/api/child_process.html#child_process_child_process
 */
exports.start = function (cmd, args, settings, options) {
	return new Instance(cmd, args, settings, options);
};
