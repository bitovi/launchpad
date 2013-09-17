var exec = require('child_process').exec;
var plist = require('plist');
var path = require('path');
var RSVP = require('rsvp');
var _ = require('underscore');
var fs = require('fs');
var winston = require('winston');

var api = {
  /**
   * A cache for promises per browser so that we don't search every time.
   */
  cache: {},
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
      args: [__dirname + '/../../../resources/phantom.js']
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
		return new RSVP.Promise(function (resolve, reject) {
			if(!browser || !browser.path) {
				// If we don't have a path to look in we can't really do anything
				return resolve(null);
			}

			if (typeof browser.plistPath === 'undefined') {
				// TODO probably check if file exists
				return exec(browser.path + ' --version', function (err, stdout) {
					if (err) return reject(err);

					browser.version = stdout.split('\n')[0].trim();
					resolve(browser);
				});
			}

			var plistInfo = path.join(browser.path, browser.plistPath);
			try {
				var data = plist.parseFileSync(plistInfo);
				browser.version = data[browser.versionKey];
				resolve(browser);
			} catch (e) {
				reject(new Error('Unable to get ' + browser.name + ' version.'));
			}
		});
	},

	/**
	 * Returns the full browser information
	 *
	 * @param {String} name The name of the browser to look for
	 * @returns {RSVP.promise} A promise that resolves with the full browser object
	 */
	getBrowser: function (name) {
		var browser = _.find(this.supportedBrowsers, function (current) {
			return current.name === name;
		});

    if(!this.cache[name]) {
      this.cache[name] = new RSVP.Promise(function (resolve, reject) {
        if (!browser) {
          return reject(new Error('Browser ' + name + ' is not supported by Launchpad on MacOS.'));
        }

        var current = _.clone(browser);
        // Check in default location first
        if (browser.defaultLocation && fs.existsSync(browser.defaultLocation)) {
          current.path = browser.defaultLocation;
          return resolve(current);
        }

        // Run the pathQuery to see if we can find it somewhere else
        exec(current.pathQuery, function (err, stdout) {
          // If we got an error or no error but the search results are empty
          if (err) {
            return reject(err)
          }

          if(!stdout.length) {
            return resolve(null);
          }

          // Set path
          current.path = stdout.split('\n')[0].trim();
          // Set the command to the path
          if (!current.command) {
            current.command = current.path;
          } else {
            // Otherwise set the arguments for the open process
            current.args = ['--wait-apps', '--new', '--fresh', '-a', current.path];
          }

          resolve(current);
        });
      });
    }

    return this.cache[name];
	}
};

exports.api = api;
exports.getVersion = api.getVersion.bind(api);
exports.getBrowser = api.getBrowser.bind(api);
