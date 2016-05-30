var bin = require('require-dir')('./bin'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    runSequence = require('run-sequence');


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
 *
 * Посмотреть основную сборку ( конкатенацию файлов )
 * можно в файле node_tasks/concat.js
 */

gulp.task('build', function (callback) {
    runSequence(
        'remove-dist',
        'build-sprite',
        'build-css',
        'build-libs',
        'build-angular-templates',
        'build-app',
        'copy-js',
        'copy-img',
        'replace',
        'md5-js',
        'md5-img',
        'md5-css',
        callback
    )
});


/**
 * сборка в режиме разработки - gulp
 * или с сервером livereload NODE_ENV=DEV gulp
 */
gulp.task('default', function (callback) {
    runSequence(
        'remove-dist',
        'build-sprite',
        'build-css',
        'build-libs',
        'build-angular-templates',
        'build-app',
        'copy-js',
        'copy-img',
        'replace-config',
        'build-css-watch',
        'build-app-watch',
        'server',
        callback
    )
});