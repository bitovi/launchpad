var launch = require('./lib'),
	config = {
		username : 'username',
		password : 'password'
	}

//launch.browserstack(config, function(err, browserstack) {
//	browserstack.ie('http://ebay.ca', { os : 'win' }, function(err, instance) {
//		console.log(instance);
//		instance.status(function() {
//			console.log(arguments);
//			instance.stop(function() {
//				console.log(arguments);
//			})
//		});
//	});
//});

launch.local(function(err, local) {
	local.firefox('http://ebay.ca', function(err, instance) {
		instance.on('stop', function(msg) {
			console.log('Local instance stopped', msg);
		});

		setTimeout(function() {
			instance.stop();
		}, 5000);
	});
});