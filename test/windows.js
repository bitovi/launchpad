var launch = require('../lib');
var win = require('../lib/local/platform/windows');

launch.local(function(err, local) {
	console.log(local.browsers);
	local.firefox('http://github.com', function(error, instance) {

	});
});
