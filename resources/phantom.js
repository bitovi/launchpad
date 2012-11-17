// A PhantomJS sript that simply opens the web page passed as the command line parameter
var page = require('webpage').create();
page.open(phantom.args[0], function (status) {
});
