var launch = require('../lib');

launch.local(function(err, local) {
  local.phantom(__dirname + '/hello.js', function(err, instance) {
    instance.on('stop', function(msg) {
      console.log('Local instance stopped', msg);
    });

    setTimeout(function() {
      instance.stop();
    }, 10000);
  });
});
