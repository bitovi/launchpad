// A local browser launcher

module.exports = function(configuration) {
	// /Applications/Safari.app/Contents/MacOS/Safari
	// /Application/Google Chrome/

	// iexplore.exe

	var Instance = Proto.extend({
		init : function(configuration) {
			this._configuration = configuration;
			this.status = 'stopped';
		},

		start : function(callback) {
		},

		stop : function(callback) {
		},

		getInfo : function(callback) {

		}
	});

	return {
		Instance : Instance,
		getInstance : function(configuration) {

		}
	}
}