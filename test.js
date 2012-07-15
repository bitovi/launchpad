var Browser = require('./lib/browserstack');

var instance = Browser({
	username : 'bitovi',
	password : ''
}).getInstance({
	browser: 'chrome',
	url : 'http://google.ca'
});

instance.start(function(err, message) {

})