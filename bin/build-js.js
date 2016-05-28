var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglifyjs');
var gulpif = require('gulp-if');
var livereload = require('gulp-livereload');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');
var cleanhtml = require('gulp-cleanhtml');
var config = require('./config');


var _ENV_ = process.env.NODE_ENV || 'DEV';


// сборка js библиотек в один файл
gulp.task('build-libs', function () {
    return gulp.src(config.js.bowerSrcs)
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.init()))
        .pipe(concat('vendor.js'))
        .pipe(gulpif(_ENV_ == 'production',
            uglify({
                mangle: true,
                compress: true,
                output: {
                    beautify: false
                }
            })
        ))
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.write()))
        .pipe(gulp.dest(config.js.distSrc));
});


// сборка темплейтов
gulp.task('build-angular-templates', function () {
    return gulp.src(config.templates.src)
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.init()))
        .pipe(gulpif(_ENV_ == 'production', cleanhtml()))
        .pipe(templateCache({
            module: config.templates.angularModuleName
        }))
        .pipe(gulpif(_ENV_ == 'production',
            uglify({
                mangle: true,
                compress: true,
                output: {
                    beautify: false
                }
            })
        ))
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.write()))
        .pipe(gulp.dest(config.templates.distSrc));
});

// сборка приложения
gulp.task('build-app', function () {
    return gulp.src(config.js.srcApp)
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.init()))
        .pipe(concat('app.js'))
        .pipe(gulpif(_ENV_ == 'production',
            uglify({
                mangle: true,
                compress: true,
                output: {
                    beautify: false
                }
            })
        ))
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.write()))
        .pipe(gulp.dest(config.js.distSrc));
});

gulp.task('build-app-watch', function () {
    gulp.watch(config.templates.src, ['build-angular-templates']);
    gulp.watch(config.js.srcApp, ['build-app']);
});

