var launch = require('../lib');
var browsers = ['firefox', 'ie'];

launch.local(function (err, local) {
	console.log(local.browsers);
	local.phantom('http://github.com', function(error, instance) {
		console.log(arguments);
	})
});
