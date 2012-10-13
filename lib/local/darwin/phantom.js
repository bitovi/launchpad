var exec = require('child_process').exec;
var plist = require('plist');
var path = require('path');

var browserPath;
var pathQuery = 'which phantomjs';

var getPath = function(callback) {
  if (browserPath) return callback(null, browserPath);

  exec(pathQuery, function (err, stdout) {
    browserPath = stdout.trim();
    callback(err, browserPath);
  });
};

var command = browserPath;
var processName = 'phantomjs';

var getVersion = function(callback) {
  getPath(function(err, browserPath){
    exec(browserPath + ' --version', function(err, stdout){
      callback(err, stdout.trim());
    });
  });
};

var getArguments = function(callback) {
  // No default arguments
  callback(null, []);
};

exports.path = getPath;
exports.command = command;
exports.process = processName;
exports.version = getVersion;
exports.args = getArguments;