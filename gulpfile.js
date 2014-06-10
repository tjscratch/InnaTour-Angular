var requireDir = require('require-dir');
var dir = requireDir('./node_tasks');

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    gulpif = require('gulp-if'),
    runSequence = require('run-sequence'),
    conf = require('./node_tasks/config');


var _ENV_ = process.env.NODE_ENV || '';

console.info('----------------------------');
gutil.log(gutil.colors.green('node environment == ' + _ENV_));
console.info('----------------------------');


// Полная сборка проект
// Сборка в production запускается в окружении - production
// NODE_ENV=production gulp build-project
gulp.task('build-project', function (callback) {
    runSequence(['styles', 'less', 'build-concat'], 'html-replace', callback);
});

gulp.task('default', ['build-project'], function (callback) {
    runSequence('watch', callback);
});
