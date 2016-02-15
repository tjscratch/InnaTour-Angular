var dir         = require('require-dir')('./node_tasks'),
    gulp        = require('gulp'),
    gutil       = require('gulp-util'),
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


gulp.task('build-project', function (callback) {
    runSequence(
        ['remove-publish', 'remove-manifest', 'remove-bower'],
        'create-manifest',

        'sprite-gen',
        'styles-app',
        'replace-config',
        ['styles', 'concat-bower-components', 'build-concat', 'widget-search', 'build-lk'],
        'version-cache',
        'html-replace',
        ['copy-project', 'copy-node-app'],
        'replace-partners',
        'replace-node-config',
        'replace-node-app',
        callback);
});


/**
 * сборка в режиме разработки - gulp
 * или с сервером livereload NODE_ENV=DEV gulp
 */
gulp.task('default', function (callback) {
    runSequence(
        ['remove-manifest', 'remove-bower'],
        'create-manifest',
        'sprite-gen',
        'styles-app',
        'replace-config',
        'widget-search',
        'build-lk',
        ['styles', 'build-templates', 'concat-bower-components', 'concat-lib', 'concat-comp-page-regions'],
        'build-angular-parts',
        'watch',
        'widget-search-watch',
        'build-lk-watch',
        callback);
});
