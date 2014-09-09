var path = require('path');

module.exports = {
  chrome: {
    pathQuery: 'mdfind \'kMDItemDisplayName == "Google Chrome" && kMDItemKind == Application\'',
    plistPath: 'Contents/Info.plist',
    command: 'open',
    process: 'Google Chrome',
    versionKey: 'KSVersion',
    defaultLocation: '/Applications/Google Chrome.app',
    args: ['--args']
  },
  canary: {
    pathQuery: 'mdfind \'kMDItemDisplayName == "Google Chrome Canary" && kMDItemKind == Application\'',
    plistPath: 'Contents/Info.plist',
    command: 'open',
    process: 'Google Chrome Canary',
    versionKey: 'KSVersion',
    defaultLocation: '/Applications/Google Chrome Canary.app',
    args: ['--args']
  },
  firefox: {
    pathQuery: 'mdfind \'kMDItemDisplayName == "Firefox" && kMDItemKind == Application\'',
    plistPath: 'Contents/Info.plist',
    command: 'open',
    process: 'firefox',
    versionKey: 'CFBundleGetInfoString',
    defaultLocation: '/Applications/Firefox.app',
    args: ['--args']
  },
  aurora: {
    pathQuery: 'mdfind \'kMDItemDisplayName == "FirefoxAurora" && kMDItemKind == Application\'',
    plistPath: 'Contents/Info.plist',
    command: 'open',
    process: 'firefox',
    versionKey: 'CFBundleGetInfoString',
    defaultLocation: '/Applications/FirefoxAurora.app',
    args: ['--args']
  },
  opera: {
    pathQuery: 'mdfind \'kMDItemDisplayName == "Opera" && kMDItemKind == Application\'',
    plistPath: 'Contents/Info.plist',
    command: 'open',
    process: 'Opera',
    versionKey: 'CFBundleShortVersionString',
    defaultLocation: '/Applications/Opera.app',
    args: ['--args']
  },
  safari: {
    pathQuery: 'mdfind \'kMDItemDisplayName == "Safari" && kMDItemKind == Application\'',
    plistPath: 'Contents/version.plist',
    command: 'open',
    process: 'Safari',
    versionKey: 'CFBundleShortVersionString',
    defaultLocation: '/Applications/Safari.app'
  },
  phantom: {
    pathQuery: 'which phantomjs',
    process: 'phantomjs',
    args: [path.join(__dirname, '..', '..', '..', 'resources/phantom.js')],
    defaultLocation: '/usr/local/bin/phantomjs',
    multi: true
  },
  nodeWebkit: {
    pathQuery: 'mdfind \'kMDItemDisplayName == "node-webkit" && kMDItemKind == Application\'',
    command: 'open',
    process: 'node-webkit',
    versionKey: 'CFBundleShortVersionString',
    defaultLocation: '/Applications/node-webkit.app',
    args: ['--args' ],
    getCommand: function(browser, url, args) {
      return browser.command + ' ' + args.join(' ') + ' --url="' + url + '"';
    }
  }
};
