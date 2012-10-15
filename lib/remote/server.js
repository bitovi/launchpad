var restify = require('restify');

var server = restify.createServer({
	name: 'launchpad-server',
	version: '0.1.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/browsers', function (req, res, next) {
	res.send(req.params);
	return next();
});

server.get('/processes', function (req, res, next) {

});

server.get('/processes/:id', function (req, res, next) {

});

server.del('/processes/:id', function(req, res, next) {

});

server.post('/processes', function(req, res, next) {

});

server.listen(8080, function () {
	console.log('%s listening at %s', server.name, server.url);
});
