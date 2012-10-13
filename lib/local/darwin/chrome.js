var exec = require('child_process').exec;
var plist = require('plist');
var path = require('path');

var browserPath;
var pathQuery = 'mdfind \'kMDItemDisplayName == "Google Chrome" && kMDItemKind == Application\'';

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

var command = 'open';
var processName = 'Google Chrome';

var getVersion = function(callback) {
  getPath(function(err, browserPath) {
    if (err) return callback(err);

    var plistInfo = path.join(browserPath, 'Contents', 'Info.plist');
    try {
      var data = plist.parseFileSync(plistInfo);
      callback(err, data.KSVersion);
    }
    catch(e) {
      callback(new Error('Unable to get ' + processName + ' version. Is it installed?'));
    }
  });
};

var getArguments = function(callback) {
  getPath(function(err, browserPath){
    if (err) return callback(err);

    callback(err, ['--wait-apps', '--new', '--fresh', '-a', browserPath]);
  });
};

exports.path = getPath;
exports.command = command;
exports.process = processName;
exports.version = getVersion;
exports.args = getArguments;