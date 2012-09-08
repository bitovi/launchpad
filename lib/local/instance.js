var events = require('events'),
	spawn = require("child_process").spawn;

function passEvents(source, dest, events, prefix) {
	prefix = prefix || '';
	events.forEach(function(event) {
		source.on(event, function() {
			var args = Array.prototype.slice.call(arguments, 0);
			args.unshift(prefix + event);
			dest.emit.apply(dest, args);
		});
	});
};

var Instance = function (cmd, args, settings) {
	var self = this,
		process = spawn(cmd, args, settings || {}),
		readableStreamEvents = ['data', 'end', 'error', 'close'];
	this.id = process.pid;
	passEvents(process.stdout, this, readableStreamEvents, 'stdout.');
	passEvents(process.stderr, this, readableStreamEvents, 'stderr.');
	passEvents(process, this, ['exit', 'close', 'disconnect', 'message'], 'process.');
	this.on('process.exit', function(code, signal) {
		self.emit('stop', {
			code : code,
			signal : signal
		});
	});
	this.process = process;
};

Instance.prototype = Object.create(events.EventEmitter.prototype);

Instance.prototype.stop = function (callback) {
	if(callback) {
		this.once('stop', function (msg) {
			callback(null, msg);
		});
	}
	// send SIGHUP to process
	this.process.kill('SIGHUP');
}

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
exports.start = function (cmd, args, settings) {
	return new Instance(cmd, args, settings);
}
