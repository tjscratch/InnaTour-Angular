var gulp   = require('gulp'),
    gulpif = require('gulp-if'),
    conf   = require('./config');

var _ENV_ = process.env.NODE_ENV;


gulp.task('watch', function () {

    gulp.watch([
        conf.styl + '/**/*.styl',
        '!' + conf.styl + '/partners/**/*.styl',
        '!' + conf.styl + '/**/ticket.styl',
        '!' + conf.styl + '/**/ie.styl',
        '!' + conf.styl + '/**/print.styl'
    ], ['styl-common'])
        .on('change', function (file) {

        });

    gulp.watch(conf.src + '/components/**/*.styl', ['styl-components', 'styl-adv'])
        .on('change', function (file) {

        });


    gulp.watch(conf.src + '/pages/**/*.styl', ['styl-pages'])
        .on('change', function (file) {

        });

    gulp.watch(conf.src + '/regions/**/*.styl', ['styl-regions'])
        .on('change', function (file) {

        });

    gulp.watch(conf.styl + '/partners/**/*.styl', ['styl-partners'])
        .on('change', function (file) {

        });

    // components page regions
    gulp.watch([
        conf.src + '/components/**/*.js',
        conf.src + '/pages/**/*.js',
        conf.src + '/regions/**/*.js'
    ], ['concat-comp-page-regions']);


    gulp.watch([
        conf.templ + '/**/*.html',
        conf.src + '/**/*.html'
    ], ['build-templates']);


    gulp.watch([
        conf.src + '/app.js',
        conf.src + '/tracking.js',
        conf.src + '/config.js',
        conf.src + '/filters.js',
        conf.src + '/mediator.js',

        conf.src + '/controllers/**/*.js',
        conf.src + '/services/**/*.js',
        conf.src + '/directives/**/*.js',
        conf.src + '/models/**/*.js',
        conf.src + '/helpers/**/*.js',
        conf.src + '/ang.helpers/**/*.js'
    ], ['build-angular-parts'])
        .on('change', function (file) {

        });
});