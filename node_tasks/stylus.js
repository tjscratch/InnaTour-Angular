var gulp = require('gulp'),
    less = require('gulp-less'),
    stylus = require('gulp-stylus'),
    minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    nib = require('nib'),
    conf = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

var optStyl = {
    use: ['nib'],
    import: ['nib']
};


gulp.task('styl-components', function () {
    return gulp.src([conf.src + '/components/**/*.styl'])
        .pipe(concat('components.styl', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.styl + '/temp'))
});

gulp.task('styl-pages', function () {
    return gulp.src([conf.src + '/pages/**/*.styl'])
        .pipe(concat('pages.styl', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.styl + '/temp'))
});

gulp.task('styl-regions', function () {
    return gulp.src([conf.src + '/regions/**/*.styl'])
        .pipe(concat('regions.styl', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.styl + '/temp'))
});



gulp.task('styl-common', function () {
    return gulp.src([conf.styl + '/common.styl'])
        .pipe(stylus(optStyl))
        .pipe(concat('common.min.css', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', minifyCSS()))
        .pipe(gulp.dest(conf.build + '/css'))

        .on('end', function() {

        })

        .on('error', function(err) {
            if (!/tests? failed/.test(err.stack)) {
                console.log(err.stack);
            }
        });
});

gulp.task('styl-ticket', function () {
    return gulp.src([conf.styl + '/ticket.styl'])
        .pipe(stylus(optStyl))
        .pipe(concat('ticket.min.css', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', minifyCSS()))
        .pipe(gulp.dest(conf.build + '/css'));

});

gulp.task('styl-ie', function () {
    return gulp.src([conf.styl + '/ie.styl'])
        .pipe(stylus(optStyl))
        .pipe(concat('ie.min.css', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', minifyCSS()))
        .pipe(gulp.dest(conf.build + '/css'));
});


gulp.task('styl-print', function () {
    return gulp.src([conf.styl + '/print.styl'])
        .pipe(stylus(optStyl))
        .pipe(concat('print.css', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', minifyCSS()))
        .pipe(gulp.dest(conf.build + '/css'));
});


gulp.task('styl-partners', function () {
    return gulp.src([conf.styl + '/partners/**/*.base.styl'])
		.pipe(stylus(optStyl))
        .pipe(gulp.dest(conf.styl + '/partners'));
});


gulp.task('styles-app', ['styl-components', 'styl-pages', 'styl-regions']);
gulp.task('styles', ['styl-common', 'styl-ticket', 'styl-ie', 'styl-print', 'styl-partners']);
