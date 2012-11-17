var restify = require('restify');
var localLauncher = require('../local');
var pkg = require('../../package.json');
var _ = require('underscore');
var platforms = {
	win32 : 'win',
	darwin : 'macos',
	linux : 'unix',
	freebsd : 'unix',
	sunos : 'unix'
};

module.exports = function (config) {
	var configuration = _.extend({
		port : 7998
	}, config);

	if (!configuration.username || !configuration.password) {
		throw new Error('Launchpad server configuration: username and password have to be provided and can not be empty');
	}

	var server = restify.createServer({
		name : 'launchpad-server',
		version : pkg.version
	});

	var instances = {};
	var instanceInfo = {};

	var api = {
		index : function (req, res, next) {
			res.send({});
		},
		listBrowsers : function (req, res, next) {
			localLauncher(function (error, local) {
				if (error) return next(error);
				res.send(local.browsers);
			});
		},
		listWorkers : function (req, res) {
			res.send(_.values(instanceInfo));
		},
		getWorker : function (req, res, next) {
			if (!instanceInfo[req.params.id]) {
				res.status(404);
				return next(new Error('Process does not exist.'));
			}
			res.send(_.pick(instanceInfo[req.params.id], 'id', 'status', 'os', 'browser', 'version'));
		},
		stopWorker : function (req, res, next) {
			var id = req.params.id;
			if (!instances[id]) {
				res.status(404);
				return next(new Error('Process does not exist or is already stopped.'));
			}

			instances[id].stop(function () {
				var time = instanceInfo[id].stopped - instanceInfo[id].started;
				res.send({ time : time });
			});
		},
		createWorker : function (req, res, next) {
			var config = req.body;
			console.log('CONFIG', config);
			var getTime = function () {
				return new Date().getTime();
			}
			localLauncher(function (error, local) {
				local(config.url, _.omit(config, 'url'), function (error, instance, browser) {
					if (error) return next(error);

					var id = instance.id;
					instances[id] = instance;
					instanceInfo[id] = _.extend({
						id : id,
						status : 'running',
						started : getTime(),
						os : platforms[process.platform] || 'unknown'
					}, browser);

					instance.on('stop', function () {
						instanceInfo[id].status = 'stopped';
						instanceInfo[id].stopped = getTime();
						delete instances[id];
					});

					res.send({ id : id });
				});
			});
		}
	}

	server.use(function (req, res, next) {
			// We have to drop this in here because some clients don't send their request content type
			if (req.method === 'POST' && req.contentType === 'application/octet-stream') {
				req.contentType = 'application/x-www-form-urlencoded';
			}
			next();
		})
		.use(restify.acceptParser(server.acceptable))
		.use(restify.queryParser())
		.use(restify.bodyParser({ mapParams : false }))
		.use(restify.authorizationParser())
		.use(function (req, res, next) {
			// Simple BASIC authorization
			if (req.authorization && req.authorization.basic &&
				req.authorization.basic.username === configuration.username &&
				req.authorization.basic.password === configuration.password) {
				return next();
			}
			res.status(401);
			next(new Error('You are not authorized'));
		});

	server.get('/', api.index);
	server.get('/1/browsers', api.listBrowsers);
	server.get('/1/worker', api.listWorkers);
	server.get('/1/worker/:id', api.getWorker);
	server.del('/1/worker/:id', api.stopWorker);
	server.post('/1/worker', api.createWorker);

	return server;
}
