var server = require('../lib/remote/server');

server().listen(8080, function () {
	console.log('Listeining...')
});
