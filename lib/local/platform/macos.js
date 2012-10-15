var exec = require('child_process').exec;
var plist = require('plist');
var path = require('path');

// TODO probably add an exclude option
// Currently also includes links created by Parallels

var browserPath;
var browsers = {
  chrome: {
    pathQuery: 'mdfind \'kMDItemDisplayName == "Google Chrome" && kMDItemKind == Application\'',
    plistPath: 'Contents/Info.plist',
    command: 'open',
    process: 'Google Chrome',
    versionKey: 'KSVersion'
  },
  firefox: {
    pathQuery: 'mdfind \'kMDItemDisplayName == "Firefox" && kMDItemKind == Application\'',
    plistPath: 'Contents/Info.plist',
    command: 'open',
    process: 'firefox',
    versionKey: 'CFBundleGetInfoString'
  },
  opera: {
    pathQuery: 'mdfind \'kMDItemDisplayName == "Opera" && kMDItemKind == Application\'',
    plistPath: 'Contents/Info.plist',
    command: 'open',
    process: 'Opera',
    versionKey: 'CFBundleShortVersionString'
  },
  phantom: {
    pathQuery: 'which phantomjs',
    process: 'phantomjs'
  },
  safari: {
    pathQuery: 'mdfind \'kMDItemDisplayName == "Safari" && kMDItemKind == Application\'',
    plistPath: 'Contents/version.plist',
    command: 'open',
    process: 'Safari',
    versionKey: 'CFBundleShortVersionString'
  }
};

var getPath = function(name, callback) {
  if (!browsers[name]) return callback();

  if (browserPath) return callback(null, browserPath);

  exec(browsers[name].pathQuery, function (err, stdout) {
    if (!stdout.length){
      return callback();
    }

    browserPath = stdout.split('\n')[0].trim();
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
	      console.log(e)
        callback(new Error('Unable to get ' + getProcessName(name) + ' version.'));
      }
    }
  });
};

var getArguments = function(name, callback) {
  // Phantom doesn't have default arguments
  if (name === 'phantom') return callback(null, []);

  getPath(name, function(err, browserPath){
    if (err) return callback(err);

    callback(err, ['--wait-apps', '--new', '--fresh', '-a', browserPath]);
  });
};

exports.path = getPath;
exports.command = getCommand;
exports.process = getProcessName;
exports.version = getVersion;
exports.args = getArguments;