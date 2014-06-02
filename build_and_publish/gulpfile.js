﻿var gulp = require('gulp'),
    htmlreplace = require('gulp-html-replace'),
    concat = require('gulp-concat'),
    stylus = require('gulp-stylus'),
    clean = require('gulp-clean'),
    csscomb = require('gulp-csscomb'),
    less = require('gulp-less'),
    runSequence = require('run-sequence'),
    templateCache = require('gulp-angular-templatecache'),
    minifyCSS = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html');

//===============Константы========================
var __BUILD_FOLDER__ = '';
var BUILD_TEST_FOLDER = 'publish_test';
var TEST_API_HOST = 'http://api.test.inna.ru';

var BUILD_RELEASE_FOLDER = 'publish_release';
var RELEASE_API_HOST = 'http://api.inna.ru';
//===============Константы========================


function changeBuildFolder(folder) {
    __BUILD_FOLDER__ = folder;
}
gulp.task('change-build-folder-TEST', function () {
    return changeBuildFolder(BUILD_TEST_FOLDER);
});
gulp.task('change-build-folder-RELEASE', function () {
    return changeBuildFolder(BUILD_RELEASE_FOLDER);
});

gulp.task('styles', function () {
    gulp.src([__BUILD_FOLDER__ + '/spa/styl/common.styl'])
        .pipe(stylus({
            use: ['nib'],
            import: ['nib']
        }))
        .pipe(concat('common.min.css'))
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest('css'));
    gulp.src([__BUILD_FOLDER__ + '/spa/styl/ie.styl'])
        .pipe(stylus({
            use: ['nib'],
            import: ['nib']
        }))
        .pipe(concat('ie.min.css'))
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest('css'));
    gulp.src([__BUILD_FOLDER__ + '/spa/styl/ticket.styl'])
        .pipe(stylus({
            use: ['nib'],
            import: ['nib']
        }))
        .pipe(concat('ticket.min.css'))
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest('css'));
    gulp.src([__BUILD_FOLDER__ + '/spa/css/main/*.less', 'css/pages/*.less'])
        .pipe(concat('main.css'))
        .pipe(less())
        .pipe(gulp.dest('css'));
});

//===============Очистка========================
function cleanFiles(destFolder) {
    var res = null;
    //удаляем все в папке [publish_test] или [publish_release], кроме
    res = gulp.src([destFolder + '/**', '!' + destFolder, '!' + destFolder + '/App_Data', '!' + destFolder + '/App_Data/**', '!' + destFolder + '/website.publishproj'], { read: false })
        .pipe(clean({ force: true }));
    return res;
}

gulp.task('templates-ang', function () {
    gulp.src([
            __BUILD_FOLDER__ + '/spa/templates/**/*.html',
            __BUILD_FOLDER__ + '/spa/js/angular/**/*.html'
    ])
	.pipe(minifyHTML({
		quotes: true
	}))
	.pipe(templateCache({
		module: 'innaApp.templates'
	}))
	.pipe(gulp.dest(__BUILD_FOLDER__ + '/spa/js/angular'));
});

gulp.task('test-clean', function () {
    return cleanFiles(BUILD_TEST_FOLDER);
});

gulp.task('release-clean', function () {
    return cleanFiles(BUILD_RELEASE_FOLDER);
});

//===============Копирование файлов========================
function copyFiles(destFolder) {
    var res = null;
    //главная
    res = gulp.src(['../index.html', '../web.config', '../closer.html'])//closer.html (для авторизации)
        .pipe(gulp.dest(destFolder));
    //страница результатов поиска туров
    res = gulp.src(['../tours/index.html', '../tours/web.config'])
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
function getSrcFiles(folder) {
    var list = [
        '/spa/js/angular/helpers/*.js',
        '/spa/js/datepicker.js',
		'/spa/js/angular/models/app.model.js',
        '/spa/js/angular/models/*.js',
        '/spa/js/angular/**/*.js'
    ];

    for (var i = 0; i < list.length; i++) {
        list[i] = folder + list[i];
    }
    return list;
}

gulp.task('test-build-app-main-js', function () {
    gulp.src(getSrcFiles(BUILD_TEST_FOLDER))
        .pipe(concat('app-main.js'))
        .pipe(gulp.dest(BUILD_TEST_FOLDER + '/spa/js'));
});
gulp.task('release-build-app-main-js', function () {
    gulp.src(getSrcFiles(BUILD_RELEASE_FOLDER))
        .pipe(concat('app-main.js'))
        .pipe(gulp.dest(BUILD_RELEASE_FOLDER + '/spa/js'));
});


//собираем все для теста
gulp.task('build-test', function (callback) {
    runSequence('test-clean',
        'change-build-folder-TEST',
        'test-copy-files-for-publish',
        ['styles', 'templates-ang'],
        'test-html-replace',
        'test-build-app-main-js',
        callback);
});

//собираем все для релиза
gulp.task('build-release', function (callback) {
    runSequence('release-clean',
        'change-build-folder-RELEASE',
        'release-copy-files-for-publish',
        ['styles', 'templates-ang'],
        'release-html-replace',
        'release-build-app-main-js',
        callback);
});

gulp.task('default', ['build-test']);
