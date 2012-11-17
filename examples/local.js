var launch = require('../lib');

launch.local({}, function(err, launcher) {
	launcher.firefox('http://github.com/daffl', function() {

	});
});