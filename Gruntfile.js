module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-build-control');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    var pkg = require('./package.json');
    // Configurable paths for the application
    var appConfig = {
        app: 'app',
        dist: 'dist'
    };
    grunt.initConfig({
        pkg: pkg,
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'app/**/*.js',
                dest: 'dist/app.min.js'
            }
        },
        buildcontrol: {
            options: {
                dir: 'dist',
                commit: true,
                push: true,
                message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            pages: {
                options: {
                    remote: 'git@github.com:mathgeek/election.git',
                    branch: 'gh-pages'
                }
            },
            local: {
                options: {
                    remote: '../',
                    branch: 'build'
                }
            }
        }
    });
    grunt.registerTask('default', ['uglify']);
};