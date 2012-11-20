var launch = require('../lib');

launch.local(function(err, launcher) {
	// User the launcher api
	launcher('http://github.com/ekryski', {
		browser : 'opera'
	}, function(error, worker) {
		console.log('Launched Opera. Process id:', worker.id);
		setTimeout(function() {
			worker.stop(function() {
				console.log('Opera stopped');
			});
		}, 4000);
	});

	// Short hand launcher
	launcher.firefox('http://github.com/daffl', function(err, worker) {
		console.log('Launched Firefox. Process id:', worker.id);
		setTimeout(function() {
			worker.stop(function() {
				console.log('Firefox stopped');
			});
		}, 2000);
	});
});