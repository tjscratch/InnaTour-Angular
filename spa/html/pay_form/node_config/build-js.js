var gulp          = require('gulp'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglifyjs'),
    templateCache = require('gulp-angular-templatecache'),
    cleanhtml     = require('gulp-cleanhtml'),
    ngAnnotate    = require('gulp-ng-annotate'),
    size          = require('gulp-size'),
    conf          = require('./config');


/**
 * Сборка шаблонов
 */
gulp.task('build-tpl', function () {
    return gulp.src([
        conf.js + '/components/**/*.html'
    ])
        .pipe(cleanhtml())
        .pipe(templateCache({
            module: 'app'
        }))
        .pipe(uglify({
            mangle: false,
            outSourceMap: true
        }))
        .pipe(gulp.dest(conf.js))
        .pipe(size({title: 'размер templates.js ------------------------------'}));
});


gulp.task('build-libs', function () {
    return gulp.src([
        conf.js + '/libs/angular.min.js',
        conf.js + '/libs/angular-timer.min.js'
    ])
        .pipe(concat('libs.js', {insertSourceName: {open: '/*', close: '*/'}}))
        .pipe(uglify({
            mangle: false,
            outSourceMap: true
        }))
        .pipe(gulp.dest(conf.build.js))
        .pipe(size({title: 'размер libs.js ----------------------------------'}));
});


/**
 * Сборка каркаса приложения
 */
gulp.task('build-app', function () {
    return gulp.src([
        conf.js + '/app.js'
    ])
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        //.pipe(uglify({
        //    mangle: false,
        //    outSourceMap: true
        //}))
        .pipe(gulp.dest(conf.build.js))
        .pipe(size({title: 'размер app.js -----------------------------------'}));
});

gulp.task('build-js', [
    'build-libs',
    'build-app'
]);