var launch = require('../lib');

launch.remote({
	port : 8080,
	username : 'launcher',
	password : 'testing'
}, function(err, api) {
	console.log(api);
	api('http://github.com', {
		browser : 'safari',
		version : 'latest'
	}, function(err, instance) {
		instance.status(function() {
			console.log(arguments);
			console.dir(instance);
			setTimeout(function() {
				instance.stop(function(err, worker) {
					console.log(worker);
				});
			}, 5000);
		})
	});
});