var restify = require('restify');
var localLauncher = require('../local');
var pkg = require('../../package.json');

module.exports = function(configuration) {
	var server = restify.createServer({
		name: 'launchpad-server',
		version: pkg.version
	});

	var instances = {};

	server.use(restify.acceptParser(server.acceptable));
	server.use(restify.queryParser());
	server.use(restify.bodyParser());

	// Simple BASIC authorization
	if(configuration.username && configuration.password) {
		server.use(restify.authorizationParser());
		server.use(function(req, res, next) {
			if(req.authorization.basic.username === configuration.username &&
				req.authorization.basic.password === configuration.password) {
					return next();
			}
			res.status(401);
			next(new Error('You are not authorized'));
		});
	}

	server.get('/browsers', function (req, res, next) {
		localLauncher(function(error, local) {
			if(error) return next(error);
			res.send(local.browsers);
		});
	});

	server.get('/instances', function (req, res, next) {
		res.send(Object.keys(processes).map(function(pid) {
			return processes[pid];
		}));
	});

	server.get('/instances/:id', function (req, res, next) {
		if(!instances[req.params.id]) {
			res.status(404);
			return next(new Error('Process does not exist.'));
		}
	});

	server.del('/instances/:id', function(req, res, next) {
		if(!instances[req.params.id]) {
			res.status(404);
			return next(new Error('Process does not exist.'));
		}
	});

	server.post('/instances', function(req, res, next) {
		var browser = req.params.browser;
		localLauncher(function(error, local) {
			if(!local[browser]) return next(new Error('I do not have ' + browser + ' for you'));
			local[browser](req.params.url, function(error, instance) {
				if(error) return next(error);
				instances[instance.id] = instance;
				res.send(instance);
			});
		});
	});

	return server;
}
