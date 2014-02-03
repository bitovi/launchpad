module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    release: {},
    simplemocha: {
      options: {
        timeout: 5000,
        reporter: 'spec'
      },

      all: { src: ['test/**/*.js'] }
    }
  });

  // Default task.
  grunt.registerTask('test', 'simplemocha');

  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-simple-mocha');
}
