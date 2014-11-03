var os = require('os');
var path = require('path');
var programFiles = os.arch() === "x64" ? process.env["ProgramFiles(x86)"] : process.env.ProgramFiles;
var cwd = path.dirname(programFiles);
var appData = appData || process.env.APPDATA;

module.exports = {
  chrome: {
    defaultLocation: path.join(appData, 'Google', 'Chrome', 'Application', 'chrome.exe') ,
    pathQuery: 'dir /s /b chrome.exe',
    cwd: cwd
  },
  canary: {
    defaultLocation: path.join(appData, 'Google', 'Chrome SxS', 'Application', 'chrome.exe')
  },
  firefox: {
    defaultLocation: path.join(programFiles, 'Mozilla Firefox', 'firefox.exe'),
    pathQuery: 'dir /s /b firefox.exe',
    cwd: cwd
  },
  aurora: {
    defaultLocation: path.join(programFiles, 'Aurora', 'firefox.exe')
  },
  opera: {
    defaultLocation: path.join(programFiles, 'Opera', 'launcher.exe'),
    pathQuery: 'dir /s /b opera.exe',
    cwd: cwd,
    imageName: 'opera.exe'
  },
  ie: {
    defaultLocation: path.join(programFiles, 'Internet Explorer', 'iexplore.exe'),
    pathQuery: 'dir /s /b iexplore.exe',
    cwd: cwd
  },
  phantomjs: {
    pathQuery: 'dir /s /b phantomjs.exe',
    args: [path.join(__dirname, '..', '..', '..', 'resources/phantom.js')],
    multi: true,
    cwd: cwd
  }
};
