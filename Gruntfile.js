module.exports = function(grunt) {
  // Load all tasks thanks to 'load-grunt-tasks' plug-in
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Repositories
    conf: {
      path: { 
        // SrcRoot: '../src/',          // Root du dossier Sources
        SrcFont: '../fonts',            // Font Directory
        BuildImg: '../img/',            // Build Images
        SrcImg: '../img/src',           // Sources Images
        BuildJS: '../js/',              // Build Javascript
        SrcJS: '../js/src',             // Sources Javascript
        LibJS: '../js/src/lib',         // Vendor Javascript sources
        BuildCSS: '../',                // Build CSS
        SrcSass: '../stylesheets',      // Sources Sass
        VenCSS: '../stylesheets/lib',   // Build CSS
      },
      
      banner: '/* <%=pkg.name %> - v<%= pkg.version %>\n'+
      ' * Author:<%= pkg.author %>\n'+
      ' * <%= grunt.template.today("mm-dd-yyyy, HH:MM:ss") %> */\n'
    },

    /* ------    PLUG-IN UPDATE    ------ */

    devUpdate: {
      main: {
        options: {
            reportUpdated: true,
            updateType   : "prompt"
        }
      }
    },
    
    /* ------    WATCHER    ------ */
    
    watch: {
      stylesheets: {
        files: ['<%= conf.path.SrcSass %>/style.scss'],
        tasks: ['devSass'],
          options: {
            spawn: false,
          },
       }        
    },
 
    /* ------    CSS BUILDER    ------ */

    // Sass lib
    sass: {                                 
      dist: {                               
        files: {                           
            '<%= conf.path.BuildCSS %>/style.css': '<%= conf.path.SrcSass %>/style.scss'   // 'destination': 'source'
        }
      }
    },

    // CSS Lint
    csslint: {
      lax: {
        options: {
          csslintrc: '.csslintrc',
        },
        src: '<%= conf.path.BuildCSS %>/style.css',
      }
    },

    //  CSS Minification
    cssmin: {
      minify: {
        files: {
          '<%= conf.path.BuildCSS %>/style.min.css': '<%= conf.path.BuildCSS %>/style.css' // 'destination': 'source'
        },
        options: {
          report:'min',
          banner: '\n/* minify */\n<%= conf.banner %>',
        },
      }
    },

    /* ------    JS    ------ */

    // JS Uglify
    uglify: {
      build: {
        files : {
          '<%= conf.path.BuildJS %>/scripts.min.js': [
          
          '<%= conf.path.SrcJS %>/*.js', 
          '<%= conf.path.SrcJS %>/*.min.js', 
          ]
        },
      options: {
        banner: '\n/* uglify */\n<%= conf.banner %>',
        report: 'min'
        },
      }
    },

    // JS hint
    jshint: {
      all: {
        src: '<%= conf.path.SrcJS %>/*.js',
      }
    },

    /* ------    BUILD    ------ */

    // Image Optimazation
    imagemin: { 
      build: {                                  // Task
          options: {                            // Target options
            optimizationLevel: 7,
            progressive: true,
            interlaced: true,
            pngquant:true,
          },
          expand: true,                         // Enable dynamic expansion
          cwd: '<%= conf.path.BuildImg %>/',    // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'],          // Actual patterns to match
          dest: '<%= conf.path.BuildImg %>/',   // Destination path prefix
      }
    },

    // Grunt concurrent 
    concurrent: {
      target: {
          tasks: ['devSass', 'watch'],
          options: {
              logConcurrentOutput: true
          }
      }
    }

  });
  // Registering tasks
  grunt.registerTask('update', ['devUpdate']);
  grunt.registerTask('devSass', ['sass','csslint','cssmin']);  
  grunt.registerTask('devJS', ['concat','jshint']);  
  grunt.registerTask('stylesheets', ['sass']);  
  grunt.registerTask('build', ['imagemin']);
  grunt.registerTask('concurrent', ['concurrent:target']);

};