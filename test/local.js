var assert = require('assert');
var http = require('http');
var connect = require('connect');
var local = require('../lib/local');
var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(6785);

describe('Local browser launcher tests', function() {
  it('does local browser and version discovery', function(done) {
    local(function(error, launcher) {
      launcher.browsers(function(error, browsers) {
        assert.ok(!error, 'No error discovering browsers');
        assert.ok(browsers.length, 'Found at least one browser');
        assert.ok(browsers[0].version, 'First browser has a version');
        done();
      });
    });
  });

  local.platform.supported().forEach(function(name) {
    it('Launches ' + name + ' browser', function(done) {
      local(function(error, launcher) {
        launcher[name]('http://localhost:6785', function(error, instance) {
          if(error) {
            // That's the only error we should get
            assert.equal(error.message, 'Browser ' + name + ' not available.');
            return done();
          }

          server.once('request', function(req, res) {
            // TODO here we could check the useragent to make sure it is the expected browser
            instance.stop(done);
          });
        });
      });
    });
  });
});
