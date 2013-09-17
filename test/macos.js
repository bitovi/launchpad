var macos = require('../lib/local/platform/macos');
var expect = require('expect.js');

describe('MacOS browser discovery', function() {
	it('Firefox', function(done) {
		macos.getBrowser('phantom').then(function(browser) {
			console.log(browser);
			done();
		});
	});
});
