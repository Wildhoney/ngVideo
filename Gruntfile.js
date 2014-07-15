module.exports = function(grunt) {

    grunt.initConfig({

        /**
         * @property pkg
         * @type {Object}
         */
        pkg: grunt.file.readJSON('package.json'),

        /**
         * @property jshint
         * @type {Object}
         */
        jshint: {
            all: 'components/*.js',
            options: {
                jshintrc: '.jshintrc'
            }
        },

        /**
         * @property uglify
         * @type {Object}
         */
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> by <%= pkg.author %> created on <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: ['dist/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },

        /**
         * @property compress
         * @type {Object}
         */
        compress: {
            main: {
                options: {
                    archive: 'releases/<%= pkg.version %>.zip'
                },
                files: [
                    { flatten: true, src: 'dist/<%= pkg.name %>.js', dest: './', filter: 'isFile' }
                ]
            }
        },

        /**
         * @property karma
         * @type {Object}
         */
        karma: {
            unit: {
                configFile: 'KarmaUnit.js',
                background: false,
                browsers: ['Firefox']
            }
        },

        /**
         * @property concat
         * @type {Object}
         */
        concat: {
            options: {
                separator: '\n\n'
            },
            dist: {
                src: ['components/Service.js', 'components/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        /**
         * @property copy
         * @type {Object}
         */
        copy: {
            vendor: {
                expand: true,
                flatten: true,
                src: ['components/*'],
                dest: 'example/js/vendor/ng-video',
                filter: 'isFile'
            },
            release: {
                src: 'releases/<%= pkg.version %>.zip',
                dest: 'releases/master.zip'
            }

        }

    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('build', ['concat', 'uglify', 'copy', 'compress']);
    grunt.registerTask('test', ['jshint', 'karma']);
    grunt.registerTask('default', ['jshint', 'karma', 'concat', 'copy', 'uglify', 'compress']);

    grunt.registerTask('custom', 'Compile a custom version of ngVideo.', function() {

        var output  = 'dist/custom/<%= pkg.name %>.custom.js',
            modules = (grunt.option('modules') || '').split(/,/ig),
            files   = modules.map(function map(file) {
                          return 'components/' + file + '.js';
                      });

        files.unshift('components/Bootstrap.js');
        files.unshift('components/Screen.js');
        files.unshift('components/Service.js');

        // Create development version.
        grunt.config.set('concat.options.separator', '\n\n');
        grunt.config.set('concat.dist.src', files);
        grunt.config.set('concat.dist.dest', output);
        grunt.task.run('concat');

        // Create minified version.
        grunt.config.set('uglify.options.banner', '/*! <%= pkg.name %> Custom by <%= pkg.author %> created on <%= grunt.template.today("yyyy-mm-dd") %> */\n');
        grunt.config.set('uglify.build.src', 'dist/custom/<%= pkg.name %>.custom.js');
        grunt.config.set('uglify.build.dest', 'dist/custom/<%= pkg.name %>.custom.min.js');
        grunt.task.run('uglify');

    });

};