var macos = require('../lib/local/platform/macos');
var expect = require('expect.js');

describe('MacOS browser discovery', function() {
	it('Firefox', function(done) {

		for(var key in macos) {
			console.log(key);
		}
		macos.getBrowser('phantom').then(function(browser) {
			macos.getBrowser('phantom').then(function(browser) {
				console.log(browser);
				done();
			}, function(error) {
				console.error(error);
			});
		}, function(error) {
			console.error(error);
		});
	});
});
