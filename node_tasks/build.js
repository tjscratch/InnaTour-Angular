var gulp = require('gulp'),
	concat = require('gulp-concat'),
    conf = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

gulp.task('build-angular-parts', ['build-controllers', 'build-services', 'build-directives', 'build-models', 'build-helpers', 'build-ang.helpers']);

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

gulp.task('build-models', function () {
    return gulp.src([conf.angular + '/models/app.model.js', conf.angular + '/models/**/*.js'])
        .pipe(concat('angular-models.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build +'/js'));
});

gulp.task('build-helpers', function () {
    return gulp.src([conf.angular + '/helpers/**/*.js'])
        .pipe(concat('angular-helpers.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build +'/js'));
});

gulp.task('build-ang.helpers', function () {
    return gulp.src([conf.angular + '/ang.helpers/**/*.js'])
        .pipe(concat('angular-ang.helpers.js', {insertSourceName:{open:'/*', close: '*/'}}))
        .pipe(gulp.dest(conf.build +'/js'));
});