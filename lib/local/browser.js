var exec = require('child_process').exec;
var Q = require('q');
var fs = require('fs');
var _ = require('underscore');

var utils = require('./utils');
var cache = {};

module.exports = function (browser) {
  var name = browser.name;

  if (!cache[name]) {
    cache[name] = Q(_.clone(browser)).then(function (current) {
      // Check in default location first
      if (browser.defaultLocation && fs.existsSync(browser.defaultLocation)) {
        current.path = browser.defaultLocation;
        return current;
      }

      // Run the pathQuery to see if we can find it somewhere else
      return Q.nfcall(exec, current.pathQuery).then(function (stdout) {
        var path = utils.getStdout(stdout);

        if (!path) {
          return null;
        }

        // Set path
        current.path = path;
        return current;
      }, function() {
        // Exec errors most likely mean the browser doesn't exist
        return null;
      });
    }).then(function (current) {
      if (current !== null) {
        // Set the command to the path
        if (!current.command) {
          current.command = current.path;
        } else if (current.command === 'open') {
          // Set the arguments for the open process
          current.args = ['--wait-apps', '--new', '--fresh', '-a', current.path].concat(current.args || []);
        }
      }

      return current;
    });
  }

  return cache[name];
};
