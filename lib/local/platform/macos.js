var exec = require('child_process').exec;
var plist = require('plist');
var path = require('path');
var Q = require('q');
var _ = require('underscore');
var fs = require('fs');
var winston = require('winston');

var api = {
  /**
   * A cache for promises per browser so that we don't search every time.
   * Lets safely assume that we don't install or upgrade the browsers during runtime
   * (although you can always clear the cache).
   */
  cache: {},
  /**
   * Information for all supported browsers.
   */
  supportedBrowsers: [
    {
      name: 'chrome',
      pathQuery: 'mdfind \'kMDItemDisplayName == "Google Chrome" && kMDItemKind == Application\'',
      plistPath: 'Contents/Info.plist',
      command: 'open',
      process: 'Google Chrome',
      versionKey: 'KSVersion',
      defaultLocation: '/Applications/Google Chrome.app'
    },
    {
      name: 'canary',
      pathQuery: 'mdfind \'kMDItemDisplayName == "Google Chrome Canary" && kMDItemKind == Application\'',
      plistPath: 'Contents/Info.plist',
      command: 'open',
      process: 'Google Chrome Canary',
      versionKey: 'KSVersion',
      defaultLocation: '/Applications/Google Chrome Canary.app'
    },
    {
      name: 'firefox',
      pathQuery: 'mdfind \'kMDItemDisplayName == "Firefox" && kMDItemKind == Application\'',
      plistPath: 'Contents/Info.plist',
      command: 'open',
      process: 'firefox',
      versionKey: 'CFBundleGetInfoString',
      defaultLocation: '/Applications/Firefox.app'
    },
    {
      name: 'aurora',
      pathQuery: 'mdfind \'kMDItemDisplayName == "FirefoxAurora" && kMDItemKind == Application\'',
      plistPath: 'Contents/Info.plist',
      command: 'open',
      process: 'firefox',
      versionKey: 'CFBundleGetInfoString',
      defaultLocation: '/Applications/FirefoxAurora.app'
    },
    {
      name: 'opera',
      pathQuery: 'mdfind \'kMDItemDisplayName == "Opera" && kMDItemKind == Application\'',
      plistPath: 'Contents/Info.plist',
      command: 'open',
      process: 'Opera',
      versionKey: 'CFBundleShortVersionString',
      defaultLocation: '/Applications/Opera.app'
    },
    {
      name: 'phantom',
      pathQuery: 'which phantomjs',
      process: 'phantomjs',
      args: [__dirname + '/../../../resources/phantom.js'],
      defaultLocation: '/usr/local/bin/phantomjs'
    },
    {
      name: 'safari',
      pathQuery: 'mdfind \'kMDItemDisplayName == "Safari" && kMDItemKind == Application\'',
      plistPath: 'Contents/version.plist',
      command: 'open',
      process: 'Safari',
      versionKey: 'CFBundleShortVersionString',
      defaultLocation: '/Applications/Safari.app'
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

	/**
	 * Gets the version for a given browser object. The `path` property
	 * needs to be set. Either reads the version from the browsers plist file
	 * or by executing it with the --version flag.
	 *
	 * @param {Object} browser The browser object
	 * @param {Function} callback The callback getting an error or the version
	 * number passed.
	 * @return {RSVP.promise} A promise that resolves with the update browser information object
	 */
	getVersion: function (browser) {
    if(!browser || !browser.path) {
      return Q.resolve(null);
    }

    if (!browser.plistPath) {
      return Q.nfcall(exec, browser.path + ' --version').then(function (stdout) {
        var version = stdout[0] && stdout[0].length && stdout[0].split('\n')[0].trim();
        if(version) {
          browser.version = version;
        }
        return browser;
      });
    }

    var plistInfo = path.join(browser.path, browser.plistPath);
    try {
      var data = plist.parseFileSync(plistInfo);
      browser.version = data[browser.versionKey];
      return Q.resolve(browser);
    } catch (e) {
      return Q.reject(new Error('Unable to get ' + browser.name + ' version.'));
    }
	},

	/**
	 * Returns the full browser information
	 *
	 * @param {String} name The name of the browser to look for
	 * @returns {RSVP.promise} A promise that resolves with the full browser object
	 */
	getBrowser: function (name) {
    if(this.cache[name]) {
      return this.cache[name];
    }

		var browser = _.find(this.supportedBrowsers, function (current) {
			return current.name === name;
		});
    var dfd;

    if(!browser) {
      dfd = Q.reject(new Error('Browser ' + name + ' is not supported by Launchpad on MacOS.'));
    } else {
      dfd = Q.resolve(_.clone(browser)).then(function(current) {
        // Check in default location first
        if (browser.defaultLocation && fs.existsSync(browser.defaultLocation)) {
          current.path = browser.defaultLocation;
          return current;
        }

        // Run the pathQuery to see if we can find it somewhere else
        return Q.nfcall(exec, current.pathQuery).then(function(stdout) {
          if(!stdout.length || typeof stdout[0] !== 'string' || !stdout[0].length) {
            return null;
          }

          // Set path
          current.path = stdout[0].split('\n')[0].trim();
          return current;
        });
      }).then(function(current) {
        if(current === null) {
          return current;
        }

        // Set the command to the path
        if (!current.command) {
          current.command = current.path;
        } else if(current.command === 'open') {
          // Set the arguments for the open process
          current.args = ['--wait-apps', '--new', '--fresh', '-a', current.path];
        }
        return current;
      });

    }

    return this.cache[name] = dfd;
	}
};

_.each(api, function(fn, name) {
  if(typeof fn === 'function') {
    exports[name] = fn.bind(api);
  }
});
exports.api = api;
