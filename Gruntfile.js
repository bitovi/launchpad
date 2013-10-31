module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    release: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint test');
  grunt.loadNpmTasks('grunt-release');
}
