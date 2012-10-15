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
	if(configuration.authorize) {
		server.use(restify.authorizationParser());
		server.use(function(req, res, next) {
			if(req.authorization.basic.username === configuration.authorize.username &&
				req.authorization.basic.password === configuration.authorize.password) {
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

	server.get('/processes', function (req, res, next) {
		var result = [];
		Object.keys(processes).forEach(function(pid) {
			result.push(processes[pid]);
		});
		res.send(result);
	});

	server.get('/processes/:id', function (req, res, next) {
		if(!instances[req.params.id]) {
			res.status(404);
			return next(new Error('Process does not exist.'));
		}
	});

	server.del('/processes/:id', function(req, res, next) {
		if(!instances[req.params.id]) {
			res.status(404);
			return next(new Error('Process does not exist.'));
		}
	});

	server.post('/processes', function(req, res, next) {
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
}
