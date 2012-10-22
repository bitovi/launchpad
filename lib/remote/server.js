var restify = require('restify');
var localLauncher = require('../local');
var pkg = require('../../package.json');
var _ = require('underscore');

module.exports = function(config) {
	var configuration = _.extend({
		username : 'launchpad',
		password : 'password',
		port : 7998
	}, config);

	var server = restify.createServer({
		name: 'launchpad-server',
		version: pkg.version
	});

	var instances = {};
	var instanceInfo = {};

	server.use(restify.acceptParser(server.acceptable));
	server.use(restify.queryParser());
	server.use(restify.bodyParser());
	server.use(restify.authorizationParser());

	// Simple BASIC authorization
	server.use(function(req, res, next) {
		console.dir(req.authorization);
		if(req.authorization && req.authorization.basic &&
			req.authorization.basic.username === configuration.username &&
			req.authorization.basic.password === configuration.password) {
				return next();
		}
		res.status(401);
		next(new Error('You are not authorized'));
	});

	server.get('/', function(req, res, next) {
		res.send({});
	});

	server.get('/1/browsers', function (req, res, next) {
		localLauncher(function(error, local) {
			if(error) return next(error);
			res.send(local.browsers);
		});
	});

	server.get('/1/worker', function (req, res) {
		res.send(_.values(instanceInfo));
	});

	server.get('/1/worker/:id', function (req, res, next) {
		if(!instanceInfo[req.params.id]) {
			res.status(404);
			return next(new Error('Process does not exist.'));
		}
		res.send(instanceInfo[req.params.id]);
	});

	server.del('/1/worker/:id', function(req, res, next) {
		var id = req.params.id;
		if(!instances[id]) {
			res.status(404);
			return next(new Error('Process does not exist or is already terminated.'));
		}

		instances[id].stop(function() {
			res.send(instanceInfo[id]);
		});
	});

	server.post('/1/worker', function(req, res, next) {
		var browser = req.params.browser;
		localLauncher(function(error, local) {
			if(!local[browser]) return next(new Error('I do not have ' + browser + ' for you.'));

			local[browser](req.params.url, function(error, instance, browser) {
				if(error) return next(error);

				var id = instance.id;
				instances[id] = instance;
				instanceInfo[id] = {
					id : id,
					status : 'running',
					started : new Date(),
					browser : browser
				}

				instance.on('stop', function() {
					instanceInfo[id].status = 'stopped';
					instanceInfo[id].stopped = new Date();
					delete instances[id];
				});

				res.send({ id : id });
			});
		});
	});

	return server;
}
