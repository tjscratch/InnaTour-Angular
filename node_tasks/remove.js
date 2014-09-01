var gulp = require('gulp');
var gulpif = require('gulp-if');
var conf = require('./config');
var rimraf = require('gulp-rimraf');

var _ENV_ = process.env.NODE_ENV || '';



gulp.task('remove-publish', function (cb) {
    return gulp.src(conf.publish, { read: false })
        .pipe(rimraf());
});
