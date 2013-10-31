var exec = require('child_process').exec;
var path = require('path');
var _ = require('underscore');
var Q = require('q');

var api = {
  cache: {},
  supportedBrowsers: exports.supported = [
    {
      name: 'chrome',
      pathQuery: 'which google-chrome',
      process: 'chrome'
    },
    {
      name: 'firefox',
      pathQuery: 'which firefox',
      process: 'firefox'
    },
    {
      name: 'opera',
      pathQuery: 'which opera',
      process: 'opera'
    },
    {
      name: 'phantom',
      pathQuery: 'which phantomjs',
      process: 'phantomjs',
      args: [__dirname + '/../../../resources/phantom.js']
    }
  ],
  /**
   * Returns a list of the names for all supported browsers
   *
   * @returns {Array}
   */
  supported: function() {
    return this.supportedBrowsers.map(function(current) {
      return current.name;
    })
  },
  getVersion: function(browser) {
    return Q.nfcall(exec, browser.command + ' --version').then(function (stdout) {
      var version = stdout[0] && stdout[0].length && stdout[0].split('\n')[0].trim();
      if(version) {
        browser.version = version;
      }
      return browser;
    });
  },
  getBrowser: function(browser) {
    var current = _.clone(browser);
    return Q.nfcall(exec, current.pathQuery).then(function(stdout) {
      var command = stdout[0] && stdout[0].length && stdout[0].split('\n')[0].trim();

      if(command) {
        current.command = command;
        return current;
      }

      return null;
    });
  }
}
