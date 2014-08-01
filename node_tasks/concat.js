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

            conf.dest + '/js/jquery.ui.datepicker-ru.js',
            conf.dest + '/js/google.maps.clustering.js',
            conf.angular + '/plugins/*.js',
            conf.dest + '/js/datepicker.js',
            conf.angular + '/helpers/*.js',
            conf.angular + '/models/app.model.js',
            conf.angular + '/models/*.js',
            conf.angular + '/app.js',

            // собираем и шаблоны тоже
            conf.build + '/js/templates.js',

            conf.angular + '/**/*.js',
			// конфиг надо исключить
			'!' + conf.angular + '/config.js'
    ])

        .pipe(concat('app-main.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulpif(_ENV_ === 'production', uglify({
            mangle: false,
            outSourceMap: true
        })))
        .pipe(gulp.dest(conf.build +'/js'));
});


gulp.task('concat-lib', function () {
    return gulp.src([
			conf.dest + '/lib/moment-with-langs.js',
            conf.dest + '/lib/underscore.js',
            conf.dest + '/lib/ractive.js',
            conf.dest + '/lib/polyfill/polyfill.js',
            conf.dest + '/lib/polyfill/classList.js',
            conf.dest + '/lib/jquery.cookie.js',
            conf.dest + '/lib/jquery.maskedinput.js',
            conf.dest + '/lib/angular-cookies.min.js',
            conf.dest + '/lib/angular-locale_ru-ru.js',
            conf.dest + '/lib/bindonce.js',
            conf.dest + '/lib/google.maps.clustering.js',
            conf.dest + '/lib/jquery-ui-1.10.4.custom/js/jquery-ui-1.10.4.custom.min.js'
    ])

        .pipe(concat('app-lib.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build +'/js'));
});


gulp.task('concat-components', function () {
    return gulp.src(conf.dest + '/js/angular/components/**/*.js')
        .pipe(concat('components.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('concat-regions', function () {
    return gulp.src(conf.dest + '/js/angular/regions/**/*.js')
        .pipe(concat('regions.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('concat-pages', function () {
    return gulp.src(conf.dest + '/js/angular/pages/**/*.js')
        .pipe(concat('pages.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});


/* NEXT TIME :) */



gulp.task('concat-jq.plugins', function () {
    return gulp.src([
            conf.dest + '/js/jquery.ui.datepicker-ru.js',
            conf.dest + '/js/angular/plugins/carousel.js',
            conf.dest + '/js/datepicker.js'
    ])
        .pipe(concat('jq.plugins.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});


gulp.task('concat-services', function () {
    return gulp.src(conf.dest + '/js/angular/services/**/*.js')
        .pipe(concat('services.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('concat-controllers', function () {
    return gulp.src(conf.dest + '/js/angular/controllers/**/*.js')
        .pipe(concat('controllers.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('concat-directives', function () {
    return gulp.src(conf.dest + '/js/angular/directives/**/*.js')
        .pipe(concat('directives.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});




gulp.task('concat-models', function () {
    return gulp.src([
            conf.dest + '/js/angular/models/app.model.js',
            conf.dest + '/js/angular/models/**/*.js'
    ])
        .pipe(concat('models.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});


gulp.task('concat-helpers', function () {
    return gulp.src([
            conf.dest + '/js/angular/helpers/utils.js',
            conf.dest + '/js/angular/helpers/**/*.js'
    ])
        .pipe(concat('helpers.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});


gulp.task('concat-api.helpers', function () {
    return gulp.src(conf.dest + '/js/angular/ang.helpers/**/*.js')
        .pipe(concat('api.helpers.js', {insertSourceName:{open:'/*', close: '*/'}}))
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