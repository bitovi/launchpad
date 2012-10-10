var fs = require('fs'),
  instance = require('./instance'),
  appPath = '/Applications/',
  apps = fs.readdirSync(appPath);

function getApplication(name, executable) {
  // TODO:
  // - also look in PATH
  // - Figure out how to get versions instead of just returning first match
  var len = apps.length,
    regex = new RegExp('.*' + name + '.*', 'i');
  for(var i = 0; i < len; i++) {
    if(apps[i] && apps[i].match(regex) !== null) {
      try {
        return fs.realpathSync(appPath + apps[i] + '/Contents/MacOS/' + executable);
      } catch(e) {
        return null;
      }
    }
  }
  return null;
};

var browserApp = {
  firefox : ['firefox', 'firefox'],
  chrome : ['chrome', 'Google Chrome'],
  safari : ['safari', 'Safari'],
  opera : ['opera', 'Opera']
}

module.exports = function(settings, callback) {
  if(!callback) {
    callback = settings;
    settings = undefined;
  }
  var api = {
    browsers : [],
    instance : function(url, options, callback) {
      if(typeof options == 'function') {
        callback = options;
        options = {};
      }
      if(!options.browser) {
        return callback(new Error('Must at least pass { browser : "<browsername>" } as instance options'));
      }
      if(!this[options.browser]) {
        return callback(new Error(options.browser + ' is not available locally!'));
      }
      this[options.browser](url, options, callback);
    }
  };
  Object.keys(browserApp).forEach(function(name) {
    var filename = getApplication.apply(null, browserApp[name]);
    if(filename !== null) {
      // TODO get version info etc.
      api.browsers.push({ browser : name, os : 'mac' });
      api[name] = function(url, options, callback) {
        if(typeof options == 'function') {
          callback = options;
          options = {};
        }
        var args = (options && options.args) || [];
        return callback(null, instance.start(filename, [url].concat(args), settings));
      }
    }
  });
  return callback(null, api);
}
