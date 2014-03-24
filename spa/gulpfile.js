var gulp = require('gulp'),
    concat = require('gulp-concat'),
    stylus = require('gulp-stylus'),
    livereload = require('gulp-livereload'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    gzip = require("gulp-gzip"),
    csscomb = require('gulp-csscomb');

gulp.task('styles', function () {
    gulp.src(['styl/search.styl', 'styl/datepicker.styl', 'styl/results.styl'])
        .pipe(concat('tickets.min.css'))
        .pipe(stylus({
            use: ['nib'],
            import: ['nib']
        }))
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest('css'))
        // .pipe(livereload());
    gulp.src(['styl/ie.styl'])
        .pipe(concat('ie.min.css'))
        .pipe(stylus({
            use: ['nib'],
            import: ['nib']
        }))
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest('css'))
        // .pipe(livereload());
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