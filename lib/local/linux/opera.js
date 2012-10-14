var exec = require('child_process').exec;
var path = require('path');

var browserPath;
var pathQuery = 'which opera';

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

var getCommand = function(callback){
  callback(null, 'open');
};

var processName = 'opera';

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
  callback(null, []);
};

exports.path = getPath;
exports.command = getCommand;
exports.process = processName;
exports.version = getVersion;
exports.args = getArguments;