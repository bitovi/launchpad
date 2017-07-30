var chromeLauncher = require('chrome-launcher-4');

function chromeWithFlags (flags) {
  return function startChrome (url) {
    return chromeLauncher
      .launch({
        startingUrl: url,
        flags: flags
      })
      .then(function (chrome) {
        return function stopChrome () {
          return chrome.kill();
        };
      });
  };
}

module.exports = {
  chromeHeadfull: chromeWithFlags([]),
  chromeHeadless: chromeWithFlags(['--headless', '--disable-gpu'])
};
