var gulp = require('gulp'),
	concat = require('gulp-concat'),
    conf = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

gulp.task('build-angular-parts', ['build-controllers', 'build-services', 'build-directives']);

gulp.task('build-controllers', function () {
    return gulp.src([conf.angular + '/controllers/**/*.js'])
        .pipe(concat('angular-controllers.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build +'/js'));
});

gulp.task('build-services', function () {
    return gulp.src([conf.angular + '/services/**/*.js'])
        .pipe(concat('angular-services.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build +'/js'));
});

gulp.task('build-directives', function () {
    return gulp.src([conf.angular + '/directives/**/*.js'])
        .pipe(concat('angular-directives.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build +'/js'));
});