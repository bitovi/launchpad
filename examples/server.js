var server = require('../lib/remote/server');

server({
	username : 'launcher',
	password : 'testing'
}).listen(8080, function () {
	console.log('Listeining...');
});
