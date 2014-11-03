var path = require('path');

module.exports = {
  chrome: {
    pathQuery: 'which google-chrome',
    process: 'chrome',
    opensTab: true
  },
  firefox: {
    pathQuery: 'which firefox',
    process: 'firefox',
    opensTab: true
  },
  opera: {
    pathQuery: 'which opera',
    process: 'opera'
  },
  phantom: {
    pathQuery: 'which phantomjs',
    process: 'phantomjs',
    args: [path.join(__dirname, '..', '..', '..', 'resources/phantom.js')],
    multi: true
  }
};
