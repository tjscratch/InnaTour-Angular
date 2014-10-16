var gulp = require('gulp');
var gulpif = require('gulp-if');
var conf = require('./config');
var del = require('del');

var _ENV_ = process.env.NODE_ENV || '';

gulp.task('remove-publish', function (cb) {
    return del(conf.publish, {
        force : true
    },cb);
});
