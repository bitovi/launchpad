var os = require('os');
var path = require('path');
var programFiles = os.arch() === "x64" ? process.env["ProgramFiles(x86)"] : process.env.ProgramFiles;
var cwd = path.dirname(programFiles);

function getPath() {
  return path.join.apply(path, arguments);
}

module.exports = {
  chrome: {
    defaultLocation: getPath(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe') ,
    pathQuery: 'dir /s /b chrome.exe',
    cwd: cwd
  },
  canary: {
    defaultLocation: getPath(process.env.LOCALAPPDATA, 'Google', 'Chrome SxS', 'Application', 'chrome.exe')
  },
  firefox: {
    defaultLocation: getPath(programFiles, 'Mozilla Firefox', 'firefox.exe'),
    pathQuery: 'dir /s /b firefox.exe',
    cwd: cwd
  },
  aurora: {
    defaultLocation: getPath(programFiles, 'Aurora', 'firefox.exe')
  },
  opera: {
    defaultLocation: getPath(programFiles, 'Opera', 'launcher.exe'),
    pathQuery: 'dir /s /b opera.exe',
    cwd: cwd,
    imageName: 'opera.exe'
  },
  ie: {
    defaultLocation: getPath(programFiles, 'Internet Explorer', 'iexplore.exe'),
    pathQuery: 'dir /s /b iexplore.exe',
    cwd: cwd
  },
  phantomjs: {
    pathQuery: 'dir /s /b phantomjs.exe',
    args: [path.join(__dirname, '..', '..', '..', 'resources/phantom.js')],
    multi: true,
    cwd: cwd
  }
}
