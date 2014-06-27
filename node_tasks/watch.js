var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    livereload = require('gulp-livereload'),
    conf = require('./config');

var _ENV_ = process.env.NODE_ENV;


gulp.task('watch', function () {
    var server = livereload();


    gulp.watch([
            conf.styl + '/**/*.styl',
            '!'+ conf.styl +'/**/ticket.styl',
            '!'+ conf.styl +'/**/ie.styl',
            '!'+ conf.styl +'/**/print.styl'
    ], ['styl-common'])
        .on('change', function(file) {
            server.changed(file.path);
        });

    gulp.watch(conf.dest+'/less/**/*', ['less']);

    gulp.watch([
            conf.templ+'/**/*.html',
            conf.dest+'/js/angular/**/*.html'
    ], ['build-templates']);
});
