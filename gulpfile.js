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
var isWin = /^win/.test(process.platform);
console.log(isWin);
console.info('----------------------------');


/**
 * Полная сборка проект
 * Сборка в production запускается в окружении - production
 * NODE_ENV=production gulp build-project
 * После сборки проект копируется в папку PUBLISH
 *
 * Посмотреть основную сборку ( конкатенацию файлов )
 * можно в файле node_tasks/concat.js
 */


gulp.task('build-project', function (callback) {
    runSequence(
        'remove-publish',
        'sprite',
        'styles-app',
        'replace-config',
        ['styles', 'build-concat'],
        'version-cache',
        'html-replace',
        'copy-project',
        'replace-partners',
        callback);
});


gulp.task('default', function (callback) {
    runSequence(
        'sprite',
        'styles-app',
        'replace-config',
        ['styles', 'build-templates', 'concat-lib', 'concat-comp-page-regions'],
        'build-angular-parts',
        'watch',
        callback);
});
