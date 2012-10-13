var launch = require('../lib');

var browsers = ['opera', 'firefox', 'safari'];

launch.local(function(err, local) {
  Object.keys(browsers).forEach(function(browser) {
    if (local[browsers[browser]]){
      local[browsers[browser]]('http://ebay.ca', function(err, instance) {
        instance.on('stop', function(msg) {
          console.log('Local ' + browsers[browser] + ' instance stopped', msg);
        });

        setTimeout(function() {
          instance.stop();
        }, 5000);
      });
    }
  });
});
