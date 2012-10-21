var server = require('../lib/remote/server');

server().listen(8080, function () {
	console.log('%s listening at %s', server.name, server.url);
});
