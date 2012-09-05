# Launchness

Launch Browsers

## API

    var launch = require('node-browserlauncher');

    // Launch a local browser
    launch.local(function(err, local) {
      local.browsers // -> List of all browsers found locally
      local.firefox('http://url', function(err, instance) {
        // An instance is an event emitter
        instance.on('stop', function() {
          console.log('Terminated local firefox');
        });
      });
    });

    launch.browserstack({
        username : 'user',
        password : 'password'
      },
      function(err, browserstack) {
        browserstack.browsers // -> List of all browsers
        browserstack.ie('http://url', function(err, instance) {
          // Shut the instance down after 5 seconds
          setTimeout(function() {
            instance.stop();
          }, 5000);
      });
    });
