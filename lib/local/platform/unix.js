var path = require('path');

module.exports = {
  chrome: {
    pathQuery: 'which google-chrome',
    process: 'chrome'
  },
  firefox: {
    pathQuery: 'which firefox',
    process: 'firefox'
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
