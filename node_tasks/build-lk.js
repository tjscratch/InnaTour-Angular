var gulp          = require('gulp'),
    uglify        = require('gulp-uglifyjs'),
    stylus        = require('gulp-stylus'),
    concat        = require('gulp-concat'),
    gulpif        = require('gulp-if'),
    nib           = require('nib'),
    templateCache = require('gulp-angular-templatecache'),
    cleanhtml     = require('gulp-cleanhtml'),
    conf          = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

/**
 * STYLUS
 * gulp build-lk-stylus
 */
gulp.task('build-lk-stylus', function () {
    return gulp.src([conf.dest + '/LK/css/lk.styl'])
        .pipe(stylus())
        .pipe(concat('lk.css'))
        .pipe(gulp.dest(conf.dest + '/LK/css'))
});


/**
 * WATCHERS
 * gulp build-lk-watch
 */
gulp.task('build-lk-watch', function () {
    gulp.watch(conf.dest + '/LK/css/*.styl', ['build-lk-stylus'])
        .on('change', function (file) {
        });
})


/**
 * gulp build-lk
 */
gulp.task('build-lk', [
    'build-lk-stylus'
]);