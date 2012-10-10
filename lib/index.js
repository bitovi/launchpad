try {
	exports.local = require('./local');
} catch(e) {
  console.log('ERROR:', e);
  // We don't have launchers for your platform
  console.log('Your platform sucks so it is unsupported');
}

exports.browserstack = require('./browserstack');
exports.headless = require('./headless');
