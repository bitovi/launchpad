var restify = require('restify');
var localLauncher = require('../local');
var pkg = require('../../package.json');
var _ = require('underscore');

module.exports = function(configuration) {
	configuration = configuration || {};
	var server = restify.createServer({
		name: 'launchpad-server',
		version: pkg.version
	});

	var instances = {};
	var instanceInfo = {};

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

	server.get('/', function(req, res, next) {
		res.send({});
	});

	server.get('/browsers', function (req, res, next) {
		localLauncher(function(error, local) {
			if(error) return next(error);
			res.send(local.browsers);
		});
	});

	server.get('/workers', function (req, res) {
		res.send(_.values(instanceInfo));
	});

	server.get('/workers/:id', function (req, res, next) {
		if(!instanceInfo[req.params.id]) {
			res.status(404);
			return next(new Error('Process does not exist.'));
		}
		res.send(instanceInfo[req.params.id]);
	});

	server.del('/workers/:id', function(req, res, next) {
		var id = req.params.id;
		if(!instances[id]) {
			res.status(404);
			return next(new Error('Process does not exist or is already terminated.'));
		}

		instances[id].stop(function() {
			res.send(instanceInfo[id]);
		});
	});

	server.post('/workers', function(req, res, next) {
		var browser = req.params.browser;
		localLauncher(function(error, local) {
			if(!local[browser]) return next(new Error('I do not have ' + browser + ' for you.'));

			local[browser](req.params.url, function(error, instance, browser) {
				if(error) return next(error);

				var id = instance.id;
				instances[id] = instance;
				instanceInfo[id] = _.extend({
					id : id,
					status : 'running',
					started : new Date()
				}, browser);

				instance.on('stop', function() {
					instanceInfo[id].status = 'stopped';
					instanceInfo[id].stopped = new Date();
					delete instances[id];
				});

				res.send(instanceInfo[id]);
			});
		});
	});

	server.listen(configuration.port || 3996);
	return server;
}
