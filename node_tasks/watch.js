var gulp = require('gulp'),
    livereload = require('gulp-livereload');

var _ENV_ = process.env.NODE_ENV;


gulp.task('watch', function () {
    var server = livereload();

    gulp.watch('styl/**/*', ['styles']);
    gulp.watch(['templates/**/*.html', 'js/angular/**/*.html'], ['templates-ang']);

    gulp.watch('*.php', function (evt) {
        server.changed(evt.path);
    });
    gulp.watch('*.html', function (evt) {
        server.changed(evt.path);
    });
});
