var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var gulpif = require('gulp-if');
var conf = require('./config');
var livereload = require('gulp-livereload');

var _ENV_ = process.env.NODE_ENV || '';


// зависимость от сборки шаблонов и других частей
gulp.task('build-concat', [
    'build-templates',
    'concat-lib',
    'concat-comp-page-regions',
    'build-angular-parts'
], function () {
    return gulp.src([
            conf.build + '/js/app-lib.js',

            conf.src + '/app.js',
            conf.build + '/js/angular-parts.js',
            conf.build + '/js/templates.js',

            conf.build + '/js/components.js',
            conf.build + '/js/regions.js',
            conf.build + '/js/pages.js'
    ])

        .pipe(concat('app-main.js'))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', uglify({
            mangle: false,
            outSourceMap: true
        })))
        .pipe(gulp.dest(conf.build + '/js'));
});


gulp.task('concat-lib', function () {
    return gulp.src([
            conf.dest + '/lib/moment.js',
            conf.dest + '/lib/moment-ru.js',
            conf.dest + '/lib/underscore.js',
            conf.dest + '/lib/ractive/ractive.0.6.1.js',
            conf.dest + '/lib/ractive/ractive-events-hover.js',
            conf.dest + '/lib/polyfill/**/*.js',
            conf.dest + '/lib/jquery.maskedinput.js',
            conf.dest + '/lib/angular-cookies.min.js',
            conf.dest + '/lib/angular-locale_ru-ru.js',
            conf.dest + '/lib/google.maps.clustering.js',
            conf.dest + '/lib/jquery.ui.datepicker-ru.js',
            conf.dest + '/lib/datepicker/datepicker.js',
            conf.dest + '/lib/jquery-ui/jquery-ui.1.11.2.min.js'
    ])

        .pipe(concat('app-lib.js', {insertSourceName: {open: '/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});


/* PARTS */
gulp.task('concat-components', function () {
    return gulp.src(conf.src + '/components/**/*.js')
        .pipe(concat('components.js', {insertSourceName: {open: '/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('concat-regions', function () {
    return gulp.src(conf.src + '/regions/**/*.js')
        .pipe(concat('regions.js', {insertSourceName: {open: '/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('concat-pages', function () {
    return gulp.src(conf.src + '/pages/**/*.js')
        .pipe(concat('pages.js', {insertSourceName: {open: '/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});


gulp.task('build-controllers', function () {
    return gulp.src([conf.src + '/controllers/**/*.js'])
        .pipe(concat('angular-controllers.js', {insertSourceName: {open: '/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('build-services', function () {
    return gulp.src([conf.src + '/services/**/*.js'])
        .pipe(concat('angular-services.js', {insertSourceName: {open: '/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('build-directives', function () {
    return gulp.src([conf.src + '/directives/**/*.js'])
        .pipe(concat('angular-directives.js', {insertSourceName: {open: '/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('build-models', function () {
    return gulp.src([
            conf.src + '/models/app.model.js',
            conf.src + '/models/**/*.js'
    ])
        .pipe(concat('angular-models.js', {insertSourceName: {open: '/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('build-helpers', function () {
    return gulp.src([conf.src + '/helpers/**/*.js'])
        .pipe(concat('angular-helpers.js', {insertSourceName: {open: '/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('build-ang.helpers', function () {
    return gulp.src([conf.src + '/ang.helpers/**/*.js'])
        .pipe(concat('angular-ang.helpers.js', {insertSourceName: {open: '/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build + '/js'));
});

gulp.task('build-widget-search', ['build-templates-widgets-search'], function () {
    return gulp.src([
        //conf.dest + '/lib/ui-bootstrap/ui-bootstrap-tpls-0.11.2.min.js',
        conf.dest + '/lib/ui-bootstrap/ui-bootstrap-custom-0.12.0.js',
        conf.dest + '/lib/ui-bootstrap/ui-bootstrap-custom-tpls-0.12.0.js',
        conf.dest + '/lib/bootstrap-datepicker/bootstrap-datepicker.min.js',
        conf.dest + '/lib/bootstrap-datepicker/bootstrap-datepicker.ru.min.js',
        conf.src + '/widgets/search/js/*.js',
        conf.build + '/widgets/templates.js'
    ])
        .pipe(concat('inna-search-widget.js'))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', uglify({
            mangle: false,
            outSourceMap: true
        })))
        .pipe(gulp.dest(conf.build + '/widgets'));
});


/*  \\ PARTS */
gulp.task('build-angular-parts', [
    'build-controllers',
    'build-services',
    'build-directives',
    'build-models',
    'build-helpers',
    'build-ang.helpers'
], function () {
    return gulp.src([

            conf.build + '/js/angular-helpers.js',
            conf.src + '/app.js',
            conf.src + '/tracking.js',
            conf.src + '/filters.js',
            conf.src + '/mediator.js',

            conf.build + '/js/angular-ang.helpers.js',
            conf.build + '/js/angular-services.js',
            conf.build + '/js/angular-controllers.js',
            conf.build + '/js/angular-directives.js',
            conf.build + '/js/angular-models.js'
    ])
        .pipe(concat('angular-parts.js'))
        .pipe(gulp.dest(conf.build + '/js'))
        .pipe(gulpif(_ENV_ == 'DEV', livereload()))

});


gulp.task('concat-comp-page-regions', [
    'concat-pages',
    'concat-regions',
    'concat-components'
], function(){
    return gulp.src(conf.src + '/mediator.js', { read: false })
        .pipe(gulpif(_ENV_ == 'DEV', livereload()))
});