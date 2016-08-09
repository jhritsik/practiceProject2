'use strict';

module.exports = function(grunt) {

    // Show elapsed time after tasks run
    require('time-grunt')(grunt);
    var YAML = require('yamljs')
    var url = require('url');
    var path = require('path')
    var urljoin = require('url-join');
        // Load all Grunt tasks
    require('load-grunt-tasks')(grunt);

    var deployRoot = "http://www.nationalgeographic.com/interactive-assets/" // trailing slash

    grunt.initConfig({
        // Configurable paths
        yeoman: {
            app: 'app',
            dist: 'dist'
        },
        site: grunt.file.readYAML('_config.yml'),

        watch: {
            options: {
                spawn: false
            },

            files: ['<%= yeoman.app %>/**/*.{js,json,txt}'],
            tasks: ['bsReload:all'],

            sass: {
                files: ['<%= yeoman.app %>/_scss/**/*.{scss,sass}'],
                tasks: ['sass:server', 'autoprefixer:server', 'bsReload:css']
            },
            autoprefixer: {
                files: ['<%= yeoman.app %>/assets/css/**/*.css'],
                tasks: ['copy:stageCss', 'autoprefixer:server']
            },
            assemble: {
                files: '<%= yeoman.app %>/**/*.{html,yml,md,mkd,markdown}',
                tasks: ['assemble:server', 'bsReload:all']
            },
        },
        prompt: {
            dist: {
                options: {
                    questions: [{
                        config: "site.name",
                        type: 'input',
                        message: 'What\'s the name of this project?',
                        default: "<%= site.name %>",
                    }, {
                        config: 'prompt.version',
                        type: 'confirm',
                        message: 'Bump the deploy version from v<%= site.version %>?',
                        default: false
                    }],
                    then: function(results, done) {
                        if (results["prompt.version"] === true) {
                            grunt.config.set('site.version', parseInt(grunt.config.get('site.version')) + 1)
                        }
                        grunt.config.set('site.assetRoot', deployRoot + path.join(grunt.config('site').name, "v" + grunt.config('site').version))
                        grunt.file.write('_config.yml', YAML.stringify(grunt.config('site')))
                        done();
                        return true
                    }

                }
            }
        },
        browserSync: {
            bsFiles: {
                src: [
                    '.assemble/**/*.html',
                    '.tmp/**/*.css',
                    '<%= yeoman.app %>/assets/**/*.{css,js,gif,jpg,jpeg,png,svg,webp}'
                ]
            },

            dist: {
                options: {
                    notify:false,
                    xip:true,
                    open:false,
                    watchTask: true,
                    server: {
                        baseDir: ['<%= yeoman.dist %>']
                    }
                }
            },
            server: {
                options: {
                    notify:false,
                    xip:true,
                    open:false,
                    watchTask: true,
                    server: {
                        baseDir: [
                            '.tmp',
                            '.assemble',
                            '<%= yeoman.app %>'
                        ]
                    },
                }
            }
        },
        bsReload: {
            css: ".tmp/**/*.css",
            all: {
                reload: true
            }

        },
        open: {
            server: {
                //path: 'http://isp.dev.nationalgeographic.com:3000'
                path:  'http://localhost:3000'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: [
                '.tmp',
                '.assemble'
            ]
        },
        sass: {
            options: {
                bundleExec: true,
                loadPath: 'app/assets/bower_components'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/_scss',
                    src: '**/*.{scss,sass}',
                    dest: '.tmp/assets/css',
                    ext: '.css'
                }]
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/_scss',
                    src: '**/*.{scss,sass}',
                    dest: '.tmp/assets/css',
                    ext: '.css'
                }]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/assets/css',
                    src: '**/*.css',
                    dest: '<%= yeoman.dist %>/assets/css'
                }]
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '.tmp/assets/css',
                    src: '**/*.css',
                    dest: '.tmp/assets/css'
                }]
            }
        },
        assemble: {
            options: {
                site: '<%= site %>',
                flatten: true,
                assets: '<%= yeoman.app %>/assets',
                layoutdir: '<%= yeoman.app %>/_layouts',
                layoutext: '.html',
                partials: '<%= yeoman.app %>/{_content,_includes}/*.{hbs,html,md}',
                helpers: ['<%= yeoman.app %>/_helpers/*.js'],
                layoutBuild: "build"
            },
            server: {
                options: {
                    assetRoot: '',
                    build: false
                },
                files: [
                    { src: ['<%= yeoman.app %>/_pages/*.{hbs,html}'], dest: '.assemble/' }
                ]
            },
            dist: {
                options: {
                    assetRoot: '<%= site.assetRoot %>',
                    build: true
                },
                files: [
                    { src: ['<%= yeoman.app %>/_pages/*.{hbs,html}'], dest: '<%= yeoman.dist %>/' }
                ]
            },
            distTest: {
                options: {
                    assetRoot: '',
                    build: true
                },
                files: [
                    { src: ['<%= yeoman.app %>/_pages/*.{hbs,html}'], dest: '<%= yeoman.dist %>/' }
                ]
            }

        },
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: ['<%= yeoman.dist %>/**/*.html']
        },
        usemin: {
            options: {
                assetsDirs: '<%= yeoman.dist %>',
                flow: {
                    steps: {
                        jquery: ['concat']
                    },
                    post: {}
                },
                blockReplacements: {
                    assetRoot: '<%= site.assetRoot %>',
                    css: function(block) {
                        var media = block.media ? ' media="' + block.media + '"' : '';
                        return '<link rel="stylesheet" href="' + urljoin(this.assetRoot, block.dest) + '"' + media + '>';
                    },
                    js: function(block) {
                        var defer = block.defer ? 'defer ' : '';
                        var async = block.async ? 'async ' : '';
                        return '<script ' + defer + async + 'src="' + urljoin(this.assetRoot, block.dest) + '"><\/script>';
                    },
                    jquery: function(block) {
                        // not currently used
                        return '<script>window.jQuery || document.write(\'<script src="' + block.dest + '"><\\/script>\')</script>'
                    }
                }
            },
            html: ['<%= yeoman.dist %>/**/*.html'],
            css: ['<%= yeoman.dist %>/assets/css/**/*.css']
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: false,
                    removeAttributeQuotes: false,
                    removeRedundantAttributes: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['**/*.html', '!assets/bower_components/**/*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        // Usemin adds files to concat
        concat: {},
        // Usemin adds files to uglify
        uglify: {
            options: {
                preserveComments: 'some',
                beautify: false,
                mangle: true
            }
        },
        // Usemin adds files to cssmin
        cssmin: {
            dist: {
                options: {
                    check: 'gzip'
                },
            }
        },
        imagemin: {
            dist: {
                options: {
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: '**/*.png',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    src: [
                        // Assemble processes and moves HTML and text files.
                        // Usemin moves CSS and javascript inside of Usemin blocks.
                        // Copy moves asset files and directories.
                        'assets/**/*', // everything in assets
                        '!assets/js/**/*', // except js
                        '!assets/bower_components/**/*', // except bower components -- usemin consolidates to /js locations
                        'assets/bower_components/jquery/dist/jquery.min.js', // this is only here because "window.jQuery || ..." has to exist outside of usemin blocks
                        '!assets/css/**/*', // except css
                        // Like Jekyll, exclude files & folders prefixed with an underscore.
                        '!**/_*{,/**}',
                        'metadata.json'
                        //'favicon.ico',
                        //'apple-touch*.png'
                    ],
                    dest: '<%= yeoman.dist %>'
                }]
            },
            // Copy CSS into .tmp directory for Autoprefixer processing
            stageCss: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>/assets/css',
                    src: '**/*.css',
                    dest: '.tmp/assets/css'
                }]
            }
        },
        buildcontrol: {
            dist: {
                options: {
                    commit: true,
                    push: true,
                    remote: 'git@github.com:natgeo/specialprojects-isp-template.git',
                    dir: '<%= yeoman.dist %>',
                    branch: 'static',
                    message: 'Built %sourceName% pages from commit %sourceCommit% on branch %sourceBranch%'
                }
            }
        },
        validation: {
            options: {
                reset: true,
                reportpath: '.log/validation-report.json',
                path: '.log/validation-status.json',
                doctype: "HTML5",

            },
            layouts: {
                files: {
                    src: ['<%= yeoman.app %>/_layouts/*.html']
                }

            },
            content: {
                options: {
                    wrapfile: '<%= yeoman.app %>/_layouts/empty.html',
                    relaxerror: ["End tag for  body seen, but there were unclosed elements."]
                },
                files: {
                    src: ['<%= yeoman.app %>/_content/*.html']
                }
            },
            includes: {
                options: {
                    wrapfile: '<%= yeoman.app %>/_layouts/empty.html'
                },
                files: {
                    src: ['<%= yeoman.app %>/_includes/*.html']
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/assets/js/**/*.js',
            ]
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            check: {
                src: [
                    '<%= yeoman.app %>/assets/css/**/*.css',
                    '<%= yeoman.app %>/_scss/**/*.scss'
                ]
            }
        },

        execute: {
            template: {
                // options: {
                //   cwd: '<%= yeoman.app %>/_scripts/',
                // },
                src: ['scripts/processTemplates.js']
            }
        },

        concurrent: {
            server: [
                'sass:server',
                'copy:stageCss',
                'assemble:server'
            ],
            dist: [
                'sass:dist',
                'copy:dist',
                'assemble:dist',
            ],
            distTest: [
                'sass:dist',
                'copy:dist',
                'assemble:distTest',
            ]

        }
    });

    // Define Tasks
    grunt.registerTask('serve', function(target) {
        if (target === 'build') {
            /// HACK to override asset root alongside distTest
            grunt.config.set("site.assetRoot", "");
            return grunt.task.run(['build:test', 'browserSync:dist', 'open:server', 'watch', ]);
        } else {
            return grunt.task.run(['dev', 'browserSync:server','open:server', 'watch']);
        }
    });

    grunt.registerTask('dev', [
        'clean:server',
        'concurrent:server',
        'autoprefixer:server'
    ]);

    grunt.registerTask('build', function(target) {
        if (target === 'test') {
            grunt.task.run([
                'clean',
                'concurrent:distTest',
                'useminPrepare',
                'concat',
                'autoprefixer:dist',
                'cssmin',
                'uglify',
                'imagemin',
                'usemin',
                'htmlmin',
            ]);
        } else {
            grunt.task.run([
                'prompt:dist',
                'clean',
                'concurrent:dist',
                'useminPrepare',
                'concat',
                'autoprefixer:dist',
                'cssmin',
                'uglify',
                'imagemin',
                'usemin',
                'htmlmin',
                'buildDone'
            ]);
        }

    })

    grunt.registerTask('buildDone', function() {
        grunt.log.writeln('Build complete! Deploy the contents of /dist to:' ['magenta'].bold);
        grunt.log.writeln(grunt.config('site').assetRoot['magenta'].bold);
    });


    // Test HTML, CSS, everything
    grunt.registerTask('check', [
        'clean:server',
        'assemble:server',
        'sass:server',
        'jshint:all',
        'csslint:check',
        'validation:content',
        'validation:includes',
    ]);

    grunt.registerTask('validate', [
        'validation:content' // html validator
    ])

    //refresh the templates
    grunt.registerTask('template', [
        'execute:template'
    ])

    grunt.registerTask('deploystatic', [
        'clean',
        'concurrent:dist',
        'autoprefixer:dist',
        'buildcontrol'
    ]);

    grunt.registerTask('default', function() {
        return grunt.task.run('serve');
    });
};
