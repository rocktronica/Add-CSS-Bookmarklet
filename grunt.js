/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-css');

  grunt.initConfig({
    lint: {
      files: ['addcss.js']
    },
    min: {
      dist: {
        src: ['addcss.js'],
        dest: 'addcss.min.js'
      }
    },
    cssmin: {
      dist: {
        src: ['addcss.css'],
        dest: 'addcss.min.css'
      }
    },
    watch: {
      files: ['addcss.js', 'addcss.css'],
      tasks: 'lint min cssmin'
    },
    jshint: {
      options: {
        strict: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        smarttabs: true
      },
      globals: {
        less: true,
        jQuery: true
      }
    },
    uglify: {}
  });

  grunt.registerTask('default', 'lint min cssmin');

};
