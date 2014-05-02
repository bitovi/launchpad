var os = require('os');
var path = require('path');
var programFiles = os.arch() === "x64" ? process.env["ProgramFiles(x86)"] : process.env.ProgramFiles;

function getPath() {
  return path.join.apply(path, arguments);
}

module.exports = {
  chrome: {
    defaultLocation: getPath(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe') ,
    pathQuery: 'dir /s /b chrome.exe'
  },
  canary: {
    defaultLocation: getPath(process.env.LOCALAPPDATA, 'Google', 'Chrome SxS', 'Application', 'chrome.exe')
  },
  firefox: {
    defaultLocation: getPath(programFiles, 'Mozilla Firefox', 'firefox.exe'),
    pathQuery: 'dir /s /b firefox.exe'
  },
  aurora: {
    defaultLocation: getPath(programFiles, 'Aurora', 'firefox.exe')
  },
  opera: {
    defaultLocation: getPath(programFiles, 'Opera', 'opera.exe'),
    pathQuery: 'dir /s /b opera.exe'
  },
  ie: {
    defaultLocation: getPath(programFiles, 'Internet Explorer', 'iexplore.exe'),
    pathQuery: 'dir /s /b iexplore.exe'
  },
  phantomjs: {
    search: 'phantomjs.exe',
    args: path.join(__dirname, '..', '..', '..', 'resources/phantom.js')
  }
}
