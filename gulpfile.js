'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');


gulp.task('default', ['browser-sync'], function() {});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:5000/#test",
        files: ["WebContent/**/*.*"],
        browser: 'google-chrome',
        port: 7000,
        reloadDelay: 2000
    });
});
gulp.task('nodemon', function(cb) {

    var started = false;

    return nodemon({
        script: 'server.js'
    }).on('start', function() {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});
