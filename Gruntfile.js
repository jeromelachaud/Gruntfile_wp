module.exports = function(grunt) {
  // Load all tasks thanks to 'load-grunt-tasks' plug-in
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Déclartion des répertoires
    conf: {
      path: { 
        // SrcRoot: '../src/',                              // Root du dossier Sources
        SrcFont: 'fonts',                                   // Font Directory
        BuildImg: 'images/build',                           // Build Images
        SrcImg: 'images/sources',                           // Sources Images
        BuildJS: 'javascripts/build',                       // Build Javascript
        VendJS: 'javascripts/build',                        // Build Javascript
        SrcJS: 'javascripts/sources',                       // Sources Javascript
        VenJS: 'javascripts/vendor',                        // Vendor Javascript sources
        SrcCSS: 'styles/sass',                              // Sources CSS
        BuildCSS: 'styles/build',                           // Build CSS
        SrcSass: 'styles/sass',                             // Sources Sass
        VenCSS: 'styles/vendor',                            // Build CSS
        CompassCSS '<%= conf.path.VenCSS %>/compass',       // Compass directory
        CompassCfg: '<%= conf.path.CompassCSS %>config.rb', // Fichier de config de Compass
      },
      banner: '/* <%=pkg.name %> - v<%= pkg.version %>\n'+
      ' * Author:<%= pkg.author %>\n'+
      ' * <%= grunt.template.today("mm-dd-yyyy, HH:MM:ss") %> */\n'
    },

    // Vérification des mises à jour des plugin
    devUpdate: {
      main: {
        options: {
            reportUpdated: true,
            updateType   : "prompt"
        }
      }
    },

    // Je te Watch et je déclanche toutes les tâches
    watch: {
      stylesheets: {
        files: ['<%= conf.path.SrcSass %>/*.*',
                '<%= conf.path.SrcJS %>/**.*',
                '<%= conf.path.SrcCSS %>/*.css',
                '<%= conf.path.BuildRoot %>/**.*'],
        tasks: ['dev'],
       }        
      stylesheets: {
        files: ['<%= conf.path.SrcSass %>/*.*',
                '<%= conf.path.SrcJS %>/**.*',
                '<%= conf.path.SrcCSS %>/*.css',
                '<%= conf.path.BuildRoot %>/**.*'],
        tasks: ['dev'],
     }         
    },
  
        // options: {
        //   livereload: true,
        //   spawn: false,
        // },

    /* ------    DEV    ------ */

    // Serveur de Dev
    connect: {
      server: {
        options: {
          debug: true,
          port: 9001,
          base: '../src',
          hostname: 'localhost',
          keepalive:false,
          livereload:true,
          open:true,
        },
      }
    },

    // Compass config
    compass: {
      dist: {
        options: {
          basePath: '<%= conf.path.SrcRoot %>',
          config: '<%= conf.path.SassCfg %>'
          //config: '../src/config.rb'

        },
      }
    },

    // Je vérifie ton code HTML
    htmlhint: {
      build: {
          options: {
              'tag-pair': true,
              'tagname-lowercase': true,
              'attr-lowercase': true,
              'attr-value-double-quotes': true,
              'doctype-first': true,
              'spec-char-escape': true,
              'id-unique': true,
              'head-script-disabled': true,
              'style-disabled': true
          },
          src: ['*.html','<%= conf.path.SrcRoot %>/*.html']
      }
    },


    // Je vérifie tes CSS
    csslint: {
      lax: {
        options: {
          csslintrc: '.csslintrc',
        },
        src: '<%= conf.path.SrcCSS %>/*.css',
      }
    },

    // Je vérifie tes JS
    jshint: {
      all: {
        src: '<%= conf.path.SrcJS %>/*.js',
      }
    },

    /* ------    BUILD    ------ */

    // Cleanage du repertoire build
    clean: {
      build: {
        src: '<%= conf.path.BuildRoot %>/'
      },
      
      stylesheets: {
        expand: true,
        cwd: '<%= conf.path.BuildCSS %>/',
        src: ['*.css', '**/*.css', '!*.min.css','!**/*.min.css'],
      },
      
      javascripts: {
        expand: true,
        cwd: '<%= conf.path.BuildJS %>/',
        src: ['*', '!scripts.min.js']
      },

      images: {
        expand: true,
        cwd: '<%= conf.path.BuildImg %>/',
        src: ['*', '!scripts.min.js']
      },
    },


    // Copie du repertoire sources vers le build
    copy: {
    build: {
      expand: true,
        cwd: '<%= conf.path.SrcRoot %>',
        src: [ '**', '!config.rb', '!sass'],
        dest: '<%= conf.path.BuildRoot %>',
  }
    },

    //  Je te Minifie ta CSS //   attention à la cascade
    cssmin: {
      minify: {
        expand: true,
        cwd: '<%= conf.path.BuildCSS %>/',
        src: ['*.css', '**/*.css'],
        dest: '<%= conf.path.BuildCSS %>/',
        ext: '.min.css',
        options: {
          banner: '\n/* minify */\n<%= conf.banner %>'
        },
      }
    },

    // Je t'Uglify ton Javascript
    uglify: {
      build: {
        expand: true,
        cwd: '<%= conf.path.BuildJS %>/',
        src: ['*.js', '**/*.js'],
        dest: '<%= conf.path.BuildJS %>/',
        ext: '.min.js',
        options: {
          banner: '\n/* uglify */\n<%= conf.banner %>',
          report: 'min'
        },
      }
    },

    // Je concatènes tes fichiers JS
    concat: {
      options: {
        separator: ';',
        banner: '/* concat */\n<%= conf.banner %>'
      },
      js: {
        src: ['<%= conf.path.BuildJS %>/*.min.js', '<%= conf.path.BuildJS %>/**/*.min.js'],
        dest: '<%= conf.path.BuildJS %>/scripts.min.js',
      },
    },

    // Je process tes fichiers HTML
    preprocess : {
      html : {
        expand: true,
        cwd: '<%= conf.path.BuildRoot %>/',
        src: ['*.html'],
        dest: '<%= conf.path.BuildRoot %>/',
          options: {
            context : {
              NODE_ENV : 'PRODUCTION'
          }
        },
      },
    },

    // Je minifie tes fichiers HTML
    htmlmin: {                                     
      build: {                                      
        options: {                                 
          collapseBooleanAttributes:true,
          removeAttributeQuotes:false,
          removeRedundantAttributes:true,
          removeOptionalTags:true,
          collapseWhitespace:true,
          banner: '\n/* htmlmin */\n<%= conf.banner %>'
        },
        expand: true,
        cwd: '<%= conf.path.BuildRoot %>/',
        src: ['*.html'],
        dest: '<%= conf.path.BuildRoot %>/',
      }
    },

    // J'optimise tes images
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

  });

  // Enregistrements des tâches
  // grunt.registerTask('launch', ['devUpdate','connect','watch']);
  grunt.registerTask('default', ['devUpdate','connect','watch']);
  grunt.registerTask('dev', ['compass','htmlhint','jshint','csslint']);
  grunt.registerTask('server', ['connect','watch']);
  grunt.registerTask('build', ['clean:build','copy','imagemin', 'uglify','concat','clean:javascripts','cssmin','clean:stylesheets','preprocess']);
  grunt.registerTask('img', ['clean:images']);



};