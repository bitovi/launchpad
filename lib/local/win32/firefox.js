var exec = require('child_process').exec;
var path = require('path');

var browserPath;
var pathQuery = 'where firefox.exe';

var getPath = function(callback) {
  if (browserPath) return callback(null, browserPath);

  exec(pathQuery, function (err, stdout) {
    if (!stdout.length){
      return callback();
    }

    //TODO: grab the first entry http://stackoverflow.com/questions/4002819/finding-the-path-of-the-program-that-will-execute-from-the-command-line-in-windo
    // or maybe use DIR http://www.pcreview.co.uk/forums/find-application-path-command-line-t3934837.html
    browserPath = stdout.trim();
    callback(err, browserPath);
  });
};

var command = 'start';
var processName = 'firefox';

var getVersion = function(callback) {
  getPath(function(err, browserPath){
    if (err) return callback(err);

    // TODO: This shit is still work in progress. Need to actually try it on windows
    exec(browserPath + ' /v CurrentVersion', function(err, stdout){
      callback(err, stdout.trim());
    });
  });
};

var getArguments = function(callback) {
  // No default arguments
  callback(null, ['/d', browserPath]);
};

exports.path = getPath;
exports.command = command;
exports.process = processName;
exports.version = getVersion;
exports.args = getArguments;