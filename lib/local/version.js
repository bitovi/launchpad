var fs = require('fs');
var exec = require('child_process').exec;
var execFile = require('child_process').execFile;
var Q = require('q');
var path = require('path');
var plist = require('plist');
var utils = require('./utils');
var debug = require('debug')('launchpad:local:version');

// Validate paths supplied by the user in order to avoid "arbitrary command execution"
var validPath = function (filename){
  var filter = /[`!@#$%^&*()+=\[\]{};'"|,<>?~]/;
  if (filter.test(filename)){
    console.log('\nInvalid character (' + filter.exec(filename)[0] + ') inside the path to the browser\n');
    return;
  }
  return filename;
};

module.exports = function(browser) {
  if (!browser || !browser.path) {
    return Q(null);
  }

  // Use WMIC to get browser version
  if (process.platform === 'win32') {
    var deferred = Q.defer();
    PromiseExec('wmic datafile where "name=\'' + browser.command.replace(/\\/gi, '\\\\') + '\'" get version')
      .then(function (exeVersion) {
        var versionSplit = exeVersion.stdout.split('\n');
        var versionString = versionSplit[1].trim();
        var regex = /\s*(.*)/;
        if (typeof versionString === 'string' && regex.test(versionString)) {
          browser.version = versionString;
          debug('Found browser version', browser.name, browser.version);
        }

        return deferred.resolve(browser);
    });
    return deferred.promise;
  }

  // Read from plist information (MacOS)
  if(browser.plistPath) {
    try {
      var plistInfo = fs.readFileSync(path.join(browser.path, browser.plistPath)).toString();
      debug('Getting Browser information from pList', plistInfo);
      var data = plist.parse(plistInfo);
      browser.version = data[browser.versionKey] || data[browser.versionKey2];
      debug('Found browser version', browser.name, browser.version);
      return Q(browser);
    } catch (e) {
      return Q.reject(new Error('Unable to get ' + browser.name + ' version.'));
    }
  }

  // Try executing <browser> --version (everything else)
  return Q.nfcall(exec, validPath(browser.path) + ' --version').then(function(stdout) {
    debug('Ran ' + validPath(browser.path) + ' --version', stdout);
    var version = utils.getStdout(stdout);
    if (version) {
      browser.version = version;
    }
    return browser;
  }, function() {
    return browser;
  });
};

/**
 * @param {string} app command to execute
 * @returns {Promise<{stdout:string, stderr:string, code:number}>}
 */
function PromiseExec(app) {
  var deferred = Q.defer();
  var child = execFile(app.split(' ')[0], app.split(' ').slice(1));
  var stdout = '';
  var stderr = '';

  child.addListener('error', deferred.reject);

  child.stdout.on('data', function (data) {
      stdout += data;
  });

  child.stderr.on('data', function (data) {
      stderr += data;
  });

  child.addListener('close', function (code) {
    deferred.resolve({ stdout: stdout, stderr: stderr, code: code} );
  });

  return deferred.promise;
}
