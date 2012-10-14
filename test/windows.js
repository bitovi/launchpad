var launch = require('../lib');

launch.local(function(err, local) {
	console.log(local.browsers);
});
