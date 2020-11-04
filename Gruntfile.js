module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-build-control');
    var pkg = require('./package.json');
    grunt.initConfig({
        pkg: pkg,
        buildcontrol: {
            options: {
                dir: 'dist',
                commit: true,
                push: true,
                message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            pages: {
                options: {
                    remote: 'git@github.com:<username>/<githubrepo>.git',
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
};