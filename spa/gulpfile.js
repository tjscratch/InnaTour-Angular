var gulp = require('gulp'),
    concat = require('gulp-concat'),
    stylus = require('gulp-stylus'),
    livereload = require('gulp-livereload'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    gzip = require("gulp-gzip"),
    csscomb = require('gulp-csscomb'),
    less = require('gulp-less');

gulp.task('styles', function () {
    gulp.src(['styl/common.styl'])
        .pipe(stylus({
            use: ['nib'],
            import: ['nib']
        }))
        .pipe(concat('common.min.css'))
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest('css'));
    gulp.src(['styl/ie.styl'])
        .pipe(stylus({
            use: ['nib'],
            import: ['nib']
        }))
        .pipe(concat('ie.min.css'))
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest('css'));
    gulp.src(['styl/ticket.styl'])
        .pipe(stylus({
            use: ['nib'],
            import: ['nib']
        }))
        .pipe(concat('ticket.min.css'))
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest('css'));
    gulp.src(['css/main/*.less', 'css/pages/*.less'])
        .pipe(concat('main.css'))
        .pipe(less())
        .pipe(gulp.dest('css'));
});

gulp.task('watch', function () {
    var server = livereload();
    gulp.watch('styl/**/*', ['styles']);
    gulp.watch('*.php', function(evt) {
        server.changed(evt.path);
    });
    gulp.watch('*.html', function(evt) {
        server.changed(evt.path);
    });
});
gulp.task('default', ['styles', 'watch']);