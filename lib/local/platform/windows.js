var path = require('path');
var programFiles = os.arch() === "x64" ? process.env["ProgramFiles(x86)"] : process.env.ProgramFiles;

module.exports = {
  chrome: {
    defaultLocation: '"' + path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe') + '"',
    pathQuery: 'dir /s /b chrome.exe'
  },
  canary: {
    defaultLocation: '"' + path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome SxS', 'Application', 'chrome.exe') + '"'
  },
  firefox: {
    defaultLocation: '"' + path.join(programFiles, 'Mozilla Firefox', 'firefox.exe') + '"',
    pathQuery: 'dir /s /b firefox.exe'
  },
  aurora: {
    defaultLocation: '"' + path.join(programFiles, 'Aurora', 'firefox.exe') + '"'
  },
  opera: {
    defaultLocation: '"' + path.join(programFiles, 'Opera', 'opera.exe') + '"',
    pathQuery: 'dir /s /b opera.exe'
  },
  ie: {
    defaultLocation: '"' + path.join(programFiles, 'Internet Explorer', 'iexplore.exe') + '"',
    pathQuery: 'dir /s /b iexplore.exe'
  },
  phantomjs: {
    search: 'phantomjs.exe',
    args: path.join(__dirname, '..', '..', '..', 'resources/phantom.js')
  }
}
