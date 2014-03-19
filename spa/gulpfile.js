var gulp = require('gulp'),
    concat = require('gulp-concat'),
    stylus = require('gulp-stylus'),
    livereload = require('gulp-livereload'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    gzip = require("gulp-gzip"),
    csscomb = require('gulp-csscomb');

gulp.task('styles', function () {
    gulp.src('styl/*.styl')
        .pipe(stylus({
            use: ['nib'],
            import: ['nib']
        }))
        .pipe(gulp.dest('css/styl'))
        .pipe(concat('search.min.css'))
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest('css/styl/min'))
        .pipe(gzip())
        .pipe(gulp.dest('css/styl/gzip'))
        .pipe(livereload());
});

gulp.task('watch', function () {
    var server = livereload();
    // gulp.watch('js/*.js', ['scripts']);
    gulp.watch('styl/*.styl', ['styles']);
    gulp.watch('*.php', function(evt) {
        server.changed(evt.path);
    });
    gulp.watch('*.html', function(evt) {
        server.changed(evt.path);
    });
});
gulp.task('default', ['styles', 'watch']);