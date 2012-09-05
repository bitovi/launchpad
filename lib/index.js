
try {
	var local = require('./local/' + process.platform);
	exports.local = local;
} catch(e) {
	// We don't have launchers for your platform
}

exports.browserstack = require('./browserstack');
