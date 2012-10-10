var exec = require('child_process').exec;
var plist = require('plist');
var path = require('path');

var browserPath;
var pathQuery = 'mdfind \'kMDItemDisplayName == "Safari" && kMDItemKind == Application\'';

var getPath = function(callback) {
  if (browserPath) return callback(null, browserPath);

  exec(pathQuery, function (err, stdout) {
    browserPath = stdout.trim();
    callback(err, browserPath);
  });
};

var command = 'open';
var processName = 'Safari';

var getVersion = function(callback) {
  getPath(function(err, browserPath) {
    var plistInfo = path.join(browserPath, 'Contents', 'version.plist');
    var data = plist.parseFileSync(plistInfo);
    callback(err, data.CFBundleShortVersionString);
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