var exec = require('child_process').exec;
var path = require('path');

var browserPath;
var pathQuery = 'which phantomjs';

var getPath = function(callback) {
  if (browserPath) return callback(null, browserPath);

  exec(pathQuery, function (err, stdout) {
    if (!stdout.length){
      return callback();
    }

    browserPath = stdout.trim();
    callback(err, browserPath);
  });
};

//TODO: Should probs wrap this in a callback instead. It is always null right now
var command = browserPath || null;
var processName = 'phantomjs';

var getVersion = function(callback) {
  getPath(function(err, browserPath){
    if (err) return callback(err);

    exec(browserPath + ' --version', function(err, stdout){
      callback(err, stdout.trim());
    });
  });
};

var getArguments = function(callback) {
  // No default arguments
  callback(null, [ __dirname + '/../../../resources/phantom.js' ]);
};

exports.path = getPath;
exports.command = command;
exports.process = processName;
exports.version = getVersion;
exports.args = getArguments;