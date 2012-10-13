var events = require('events');
var spawn = require("child_process").spawn;
var exec = require("child_process").exec;

function passEvents(source, dest, events, prefix) {
	prefix = prefix || '';
	events.forEach(function(event) {
		source.on(event, function() {
			var args = Array.prototype.slice.call(arguments, 0);
			args.unshift(prefix + event);
			dest.emit.apply(dest, args);
		});
	});
}

var Instance = function (cmd, args, settings, options) {
	// console.log(cmd, args, settings, options);

	this.options = options || {};
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

	console.log(this.options.name + ' started with PID: ' + this.id);
};

Instance.prototype = Object.create(events.EventEmitter.prototype);

Instance.prototype.stop = function (callback) {
	// send SIGKILL to process
	// this.process.kill('SIGKILL');
	// if(callback) {
	// 	this.once('stop', function (msg) {
	// 		callback(null, msg);
	// 	});
	// }

	// TODO: Not sure if I entirely like this solution. Could get messy with using process names
	// Maybe we should instead get correct process ids. For some reason they are not correct when using
	// the 'open' command on Darwin. Probably need to use exec with grep and get the correct pid.
	// On Linux will be easier.
	var self = this;

	// send SIGKILL to process by name
	spawn('killall', [this.options.process]).on('exit', function(code, signal){
		self.once('stop', function (err) {
			if (callback){
				callback(null, {
					code : code,
					signal : signal
				});
			}
		});
	});
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
