var gulp = require('gulp');
var file = require('gulp-file');
var conf = require('./config');
var del = require('del');

var _ENV_ = process.env.NODE_ENV || '';

gulp.task('remove-publish', function (cb) {
    return del(conf.publish, {
        force : true
    },cb);
});

gulp.task('remove-manifest', function (cb) {
    return del(conf.node_path + '/manifest.json', {
        force : true
    },cb);
});

gulp.task('create-manifest', function (cb) {
    return file('manifest.json', '{}', { src: true })
        .pipe(gulp.dest(conf.node_path));
});


