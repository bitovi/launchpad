var fs = require('fs');
var path = require('path');
var instance = require('./instance');
var platform = require('./' + process.platform);

var browsers = {
	'chrome' : {
		name : 'chrome',
		regex : /chrome/i,
		type : 'webkit'
	},
	'chromium' : {
		name : 'chromium',
		regex : /chromium/i,
		type : 'webkit'
	},
	'firefox' : {
		name : 'firefox',
		regex : /firefox/i,
		type : 'gecko'
	},
	'phantom' : {
		name : 'phantom',
		regex : /phantom/i,
		type : 'webkit',
		headless : true
	},
	'safari' : {
		name : 'safari',
		regex : /safari/i,
		type : 'webkit'
	},
	'ie' : {
		windows : true,
		name : 'ie',
		type : 'ie'
	},
	'opera' : {
		name : 'opera',
		regex : /opera/i,
		type : 'opera'
	}
};

module.exports = function (settings, callback) {
	if (!callback) {
		callback = settings;
		settings = undefined;
	}

	var api = {
		browsers : []
	};
	var pending = Object.keys(browsers).length;

	Object.keys(browsers).forEach(function (name) {
		var browser = browsers[name];

    detect(name, function(err, version, command, process, path, defaultArgs) {
      if (err) {
        console.log(err);
      }
      else if (version && path) {
        api.browsers.push(merge(browser, {
          path: path || null,
          command: command || path,
          process: process || name,
          version: version,
          args: defaultArgs || []
        }));

				api[name] = function (url, options, callback) {
					if (typeof options == 'function') {
						callback = options;
						options = {};
					}

					var args = (options && options.args) ? browser.args.concat(options.args) : browser.args;
					return callback(null, instance.start(browser.command, args.concat([url]), settings, browsers[name]));
				};
			}

      if (--pending === 0) {
        var availableBrowsers = [];

        Object.keys(api.browsers).forEach(function(b) {
          availableBrowsers.push(api.browsers[b].name);
        });

        console.log('Available browsers: ', availableBrowsers);
        return callback(null, api);
      }
    });
  });
};

function detect(name, callback) {
  platform.path(name, function(err, path) {
    if (err) return callback(err);
    if (!path) {
      // console.log('Things could be more awesome if you installed ' + name);
      return callback();
    }

    platform.command(name, function(err, command) {
      if (err) return callback(err);

      platform.version(name, function(err, version) {
        if (err) return callback(err);

        platform.args(name, function(err, defaultArgs) {
          if (err) return callback(new Error('failed to get default arguments for ' + name));

          callback(err, version, command, platform.process(name), path, defaultArgs);
        });
      });
    });
	});
}

function merge(dest, src) {
	for (var prop in src) {
		if (src[prop]) dest[prop] = src[prop];
	}

	return dest;
}
