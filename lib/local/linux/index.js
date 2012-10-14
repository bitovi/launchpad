var exec = require('child_process').exec;
var path = require('path');

var browserPath;
var browsers = {
  chrome: {
    pathQuery: 'which google-chrome',
    process: 'chrome'
  },
  firefox: {
    pathQuery: 'which firefox',
    process: 'firefox'
  },
  opera: {
    pathQuery: 'which opera',
    process: 'opera'
  },
  phantom: {
    pathQuery: 'which phantomjs',
    process: 'phantomjs'
  }
};

var getPath = function(name, callback) {
  if (!browsers[name]) return callback();

  if (browserPath) return callback(null, browserPath);

  exec(browsers[name].pathQuery, function (err, stdout) {
    if (!stdout.length){
      return callback();
    }

    browserPath = stdout.trim();
    callback(err, browserPath);
  });
};

var getCommand = function(name, callback){
  if (!browsers[name]) return callback();

  //Guarding for Phantom in this case
  if (browsers[name].command === undefined){
    getPath(name, function(err, browserPath){
      if (err) return callback(err);

      callback(err, browserPath);
    });
  }
  else {
    callback(null, browsers[name].command);
  }
};

var getProcessName = function(name){
  if (!browsers[name]) return null;

  return browsers[name].process;
};

var getVersion = function(name, callback) {
  if (!browsers[name]) return callback();

  getPath(name, function(err, browserPath) {
    if (err) return callback(err);

    if (browsers[name].plistPath === undefined){
      exec(browserPath + ' --version', function(err, stdout){
        callback(err, stdout.trim());
      });
    }
    else {
      var plistInfo = path.join(browserPath, browsers[name].plistPath);
      try {
        var data = plist.parseFileSync(plistInfo);
        callback(err, data[browsers[name].versionKey]);
      }
      catch(e) {
        callback(new Error('Unable to get ' + getProcessName(name) + ' version.'));
      }
    }
  });
};

var getArguments = function(name, callback) {
  // No default args
  callback(null, []);
};

exports.path = getPath;
exports.command = getCommand;
exports.process = getProcessName;
exports.version = getVersion;
exports.args = getArguments;