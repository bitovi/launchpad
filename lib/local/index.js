var _ = require('underscore');
var Q = require('q');
var instance = require('./instance');
var platforms = {
	win32 : './platform/windows',
	darwin : './platform/macos',
	linux : './platform/unix',
	freebsd : './platform/unix',
	sunos : './platform/unix'
};
var platform = require(platforms[process.platform]);
var normalize = function(browser) {
	return _.pick(browser, 'name', 'version');
}

module.exports = function (settings, callback) {
	if (!callback) {
		callback = settings;
		settings = undefined;
	}

  var api = function(url, options, callback) {
    platform.getBrowser(options.name).then(function(browser) {
      if(browser === null) {
        return Q.reject(new Error('Browser ' + options.name + ' not available.'));
      }

      var args = browser.args || [];
      args.push(url);

      return Q.ninvoke(instance, 'start', browser.command, args, settings, browser);
    }).nodeify(callback);
  }

  api.browsers = function(callback) {
    var deferreds = platform.supported().map(function(name) {
      return platform.getBrowser(name).then(platform.getVersion);
    });

    Q.all(deferreds).then(function(browsers) {
      return _.map(_.compact(browsers), normalize);
    }).nodeify(callback);
  }

  platform.supported().forEach(function(browser) {
    api[browser] = function(url, options, callback) {
      if(!callback) {
        callback = options;
        options = {};
      }

      options.name = browser;

      return api(url, options, callback);
    }
  });

  callback(null, api);
}

module.exports.platform = platform;
