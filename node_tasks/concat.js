var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var gulpif = require('gulp-if');
var conf = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

// зависимость от сборки шаблонов
gulp.task('build-concat', ['build-templates', 'concat-lib', 'concat-comp-page-regions'], function () {
    return gulp.src([
            conf.build + '/js/app-lib.js',

            conf.dest + '/js/angular/config.js',
            conf.dest + '/js/jquery.ui.datepicker-ru.js',
            conf.dest + '/js/google.maps.clustering.js',
            conf.dest + '/js/angular/plugins/*.js',
            conf.dest + '/js/datepicker.js',
            conf.dest + '/js/angular/helpers/*.js',
            conf.dest + '/js/angular/models/app.model.js',
            conf.dest + '/js/angular/models/*.js',
            conf.dest + '/js/angular/app.js',

            // собираем и шаблоны тоже
            conf.build + '/js/templates.js',

            conf.dest + '/js/angular/**/*.js'
    ])

        .pipe(concat('app-main.js'))
        .pipe(gulpif(_ENV_ === 'production', uglify({
            mangle: false,
            outSourceMap: true
        })))
        .pipe(gulp.dest(conf.build +'/js'));
});


gulp.task('concat-lib', function () {
    return gulp.src([
            conf.dest + '/lib/underscore.js',
            conf.dest + '/lib/ractive.js',
            conf.dest + '/lib/polyfill.js',
            conf.dest + '/lib/jquery.cookie.js',
            conf.dest + '/lib/jquery.maskedinput.js',
            conf.dest + '/lib/angular-cookies.min.js',
            conf.dest + '/lib/angular-locale_ru-ru.js',
            conf.dest + '/lib/bindonce.js',
            conf.dest + '/lib/google.maps.clustering.js',
            conf.dest + '/lib/jquery-ui-1.10.4.custom/js/jquery-ui-1.10.4.custom.min.js'
    ])

        .pipe(concat('app-lib.js'))
        .pipe(gulp.dest(conf.build +'/js'));
});


gulp.task('concat-components', function () {
    return gulp.src(conf.dest + '/js/angular/components/**/*.js')
        .pipe(concat('components.js'))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('concat-regions', function () {
    return gulp.src(conf.dest + '/js/angular/regions/**/*.js')
        .pipe(concat('regions.js'))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('concat-pages', function () {
    return gulp.src(conf.dest + '/js/angular/pages/**/*.js')
        .pipe(concat('pages.js'))
        .pipe(gulp.dest(conf.build + '/js'));
});


/* NEXT TIME :) */



gulp.task('concat-jq.plugins', function () {
    return gulp.src([
            conf.dest + '/js/jquery.ui.datepicker-ru.js',
            conf.dest + '/js/angular/plugins/carousel.js',
            conf.dest + '/js/datepicker.js'
    ])
        .pipe(concat('jq.plugins.js'))
        .pipe(gulp.dest(conf.build + '/js'));
});


gulp.task('concat-services', function () {
    return gulp.src(conf.dest + '/js/angular/services/**/*.js')
        .pipe(concat('services.js'))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('concat-controllers', function () {
    return gulp.src(conf.dest + '/js/angular/controllers/**/*.js')
        .pipe(concat('controllers.js'))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('concat-directives', function () {
    return gulp.src(conf.dest + '/js/angular/directives/**/*.js')
        .pipe(concat('directives.js'))
        .pipe(gulp.dest(conf.build + '/js'));
});




gulp.task('concat-models', function () {
    return gulp.src([
            conf.dest + '/js/angular/models/app.model.js',
            conf.dest + '/js/angular/models/**/*.js'
    ])
        .pipe(concat('models.js'))
        .pipe(gulp.dest(conf.build + '/js'));
});


gulp.task('concat-helpers', function () {
    return gulp.src([
            conf.dest + '/js/angular/helpers/utils.js',
            conf.dest + '/js/angular/helpers/**/*.js'
    ])
        .pipe(concat('helpers.js'))
        .pipe(gulp.dest(conf.build + '/js'));
});


gulp.task('concat-api.helpers', function () {
    return gulp.src(conf.dest + '/js/angular/ang.helpers/**/*.js')
        .pipe(concat('api.helpers.js'))
        .pipe(gulp.dest(conf.build + '/js'));
});


gulp.task('concat-comp-page-regions', [
    'concat-pages',
    'concat-regions',
    'concat-components'
]);

gulp.task('concat-js', [
    'concat-lib',
    'concat-jq.plugins',
    'concat-services',
    'concat-controllers',
    'concat-directives',
    'concat-regions',
    'concat-components',
    'concat-models',
    'concat-helpers',
    'concat-api.helpers'
]);