try {
	exports.local = require('./local');
}
catch(e) {
  console.log('ERROR:', e);
  console.log('What platform are you on? We support everything!');
}

exports.browserstack = require('./browserstack');
