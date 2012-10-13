var expect = require('expect.js');
var launch = require('../../lib');

describe("Local browser launcher tests", function() {
	it("Returns a list of browsers for your system", function(done) {
		launch.local(function(err, local) {
			expect(local).to.have.property('browsers');
			expect(local.browsers.length).to.be.greaterThan(0);
			done();
		});
	});

	it("Launches and kills all browsers", function(done) {
		launch.local(function(err, local) {
			expect(local).to.have.property('browsers');
			local[local.browsers[0].name]('http://github.com/ekryski', function(err, instance) {
				setTimeout(function() {
					instance.stop(function() {
						done();
					});
				}, 500);
			});
		});
	});
});
