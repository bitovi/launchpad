var local = require('../lib/local');
var expect = require('expect.js');
var Q = require('q');

describe('MacOS browser discovery', function() {
	it('Firefox', function(done) {
    local(function(error, launch) {
      launch.aurora('http://github.com', function() {
        console.log(arguments);
        done();
      })
    });
	});
});

//function helloWorld(req, res) {
//  res.writeHead(200, { 'Content-Type': 'text/plain' });
//  res.end('hello world');
//}
//
//connect.createServer(helloWorld).listen(3000);