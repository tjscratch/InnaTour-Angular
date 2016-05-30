var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');


gulp.task('server', ['browser-sync'], function () {
});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:8666",
        serveStatic: ['./dist'],
        //files: [
        //    "./dist"
        //],
        browser: "google chrome",
        port: 3000,
    });
});
gulp.task('nodemon', function (cb) {

    var started = false;

    return nodemon({
        script: './node-app/app.js'
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    });
});