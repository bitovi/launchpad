var launch = require('../lib');
var win = require('../lib/local/platform/windows');

launch.local(function(err, local) {
	console.log(local.browsers);
	local.ie('http://github.com', function(error, instance) {
		setTimeout(function() {
			console.log('Stopping instance');
			instance.stop(function(err, message) {
				console.log(arguments);
			});
		}, 5000)
	});
});
