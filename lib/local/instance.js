var spawn = require("child_process").spawn;
var exec = require("child_process").exec;
var EventEmitter = require('events').EventEmitter;

var getProcessId = function(name, callback) {

	var commands = {
		win32 : '', //TODO: figure this out
		darwin : "ps -clx | grep '" + name + "$' | awk '{print $2}' | head -1",
		linux : "ps -ax | grep '" + name + "$' | awk '{print $2}' | head -1",
		freebsd : "ps -clx | grep '" + name + "$' | awk '{print $2}' | head -1",
		sunos : "ps -ax | grep '" + name + "$' | awk '{print $2}' | head -1" // Don't actually know about this
	};

	// Get the process with the given name if it is running
	exec(commands[process.platform], function(err, stdout) {
		var pid = stdout.trim();
		if(!pid) {
			return callback(new Error('There does not seem to be a ' + name + ' process running'));
		}
		callback(null, pid);
	});
};

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

Instance.prototype.getPid = function(callback) {
	if(this.options.process) {
		getProcessId(this.options.process, callback);
	} else {
		callback(null, this.process.pid);
	}
};

Instance.prototype.stop = function (callback) {
	if (callback) {
		this.once('stop', function(data) {
			callback(null, data);
		});
	}

	if (this.options.command === 'open') {
		this.getPid(function(err, pid) {
			if (err) {
				callback(err);
			}

			// We kill the process with SIGTERM (requesting termination)
			spawn('kill', ['-s', 'TERM', pid]);
		});
	}
	else {
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
exports.start = function (cmd, args, settings, options, callback) {
	var getInstance = function() {
		return new Instance(cmd, args, settings, options);
	};

	if(options.process) {
		getProcessId(options.process, function(err, pid) {
			if(!err) {
				return callback(new Error(options.process + ' seems already running with process id ' + pid));
			}
			return callback(null, getInstance());
		});
	} else {
		callback(null, getInstance());
	}
};
