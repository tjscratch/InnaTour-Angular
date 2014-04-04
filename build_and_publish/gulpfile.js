var gulp = require('gulp'),
    htmlreplace = require('gulp-html-replace'),
    concat = require('gulp-concat'),
    runSequence = require('run-sequence');

//===============Константы========================
var BUILD_TEST_FOLDER = 'publish_test';
var TEST_API_HOST = 'http://api.test.inna.ru';

var BUILD_RELEASE_FOLDER = 'publish_release';
var RELEASE_API_HOST = 'http://api.inna.ru';
//===============Константы========================

//===============Копирование файлов========================
function copyFiles(destFolder){
    var res = null;
    //главная
    res = gulp.src('../index.html')
        .pipe(gulp.dest(destFolder));
    //страница результатов поиска туров
    res = gulp.src('../tours/index.html')
        .pipe(gulp.dest(destFolder + '/tours'));

    //папка spa, кроме node_modules
    res = gulp.src([
        '../spa/**', //все в папке spa
        //исключаем
        '!/**/node_modules/**', '!/**/node_modules',//любые папки node_modules и вложенные
        '!/**/gulpfile.js', '!/**/package.json',
        '!/**/*.sublime-project', '!/**/*.sublime-workspace'
    ])
        .pipe(gulp.dest(destFolder + '/spa'));
    return res;
}

gulp.task('test-copy-files-for-publish', function () {
    return copyFiles(BUILD_TEST_FOLDER);
});
gulp.task('release-copy-files-for-publish', function () {
    return copyFiles(BUILD_RELEASE_FOLDER);
});

//===============Замена в html========================
function replaceHtml(destFolder, apiHost) {
    function replace(sourceFile, destPath, apiHost) {
        //заменяем все ангулар скрипты на один
        return gulp.src(sourceFile)
          .pipe(htmlreplace({
              'app-main-js': '/spa/js/app-main.js',
              'app-host': 'app_main.host = \'' + apiHost + '\';'
          }))
          .pipe(gulp.dest(destPath));
    };

    //для главной
    replace(destFolder + '/index.html', destFolder, apiHost);
    //для туров
    return replace(destFolder + '/tours/index.html', destFolder + '/tours', apiHost);
}

gulp.task('test-html-replace', function () {
    return replaceHtml(BUILD_TEST_FOLDER, TEST_API_HOST);
});
gulp.task('release-html-replace', function () {
    return replaceHtml(BUILD_RELEASE_FOLDER, RELEASE_API_HOST);
});

//===============Склеиваем app-main.js========================
gulp.task('test-build-app-main-js', function () {
    gulp.src(BUILD_TEST_FOLDER + '/spa/js/angular/**/*.js')
		.pipe(concat('app-main.js'))
        .pipe(gulp.dest(BUILD_TEST_FOLDER + '/spa/js'));
});
gulp.task('release-build-app-main-js', function () {
    gulp.src(BUILD_RELEASE_FOLDER + '/spa/js/angular/**/*.js')
		.pipe(concat('app-main.js'))
        .pipe(gulp.dest(BUILD_RELEASE_FOLDER + '/spa/js'));
});

//===============Таски========================

//собираем все для теста
gulp.task('build-test', function (callback) {
    runSequence('test-copy-files-for-publish',
              'test-html-replace',
              'test-build-app-main-js',
              callback);
});

//собираем все для релиза
gulp.task('build-release', function (callback) {
    runSequence('release-copy-files-for-publish',
              'release-html-replace',
              'release-build-app-main-js',
              callback);
});

gulp.task('default', ['build-test']);
