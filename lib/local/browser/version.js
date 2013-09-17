var exec = require('child_process').exec;
var plist = require('plist');
var path = require('path');
var RSVP = require('rsvp');
var os = process.platform;

module.exports = function (browser) {
  return new RSVP.Promise(function (resolve, reject) {
    if(!browser || !browser.path) {
      // If we don't have a path to look in we can't really do anything
      return resolve(null);
    }

    var setResult = function(version) {
      browser.version = version;
      return resolve(browser);
    }

    // Windows, run provided ShowVer.exe and regex "ProductVersion" from it
    if(os === 'win32') {
      var command = path.join(__dirname, '..', '..', '..', 'resources', 'ShowVer.exe "' + browser.path + '"');

      return exec(command, function (error, stdout) {
        var regex = /ProductVersion:\s*(.*)/;
        // ShowVer.exe returns a non zero status code even if it works
        if (typeof stdout === 'string' && regex.test(stdout)) {
          return setResult(stdout.match(regex)[1]);
        }

        reject(error || new Error('Could not read ProductVersion from ShowVer.exe'));
      });
    }

    // MacOS read from pList if plistPath is set
    if(os === 'darwin' && browser.plistPath && browser.versionKey) {
      var plistInfo = path.join(path.dirname(browser.path), browser.plistPath);

      return plist.parseFile(plistInfo, function(error, data) {
        if(error) { return reject(error); }
        setResult(data[browser.versionKey]);
      });
    }

    // run <browser> --version and try to grab it from stdout
    exec(browser.path + ' --version', function (err, stdout) {
      if (err) { return reject(err); }
      setResult(stdout.split('\n')[0].trim());
    });
  });
}
