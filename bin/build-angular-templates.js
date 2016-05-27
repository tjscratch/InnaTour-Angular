var gulp = require('gulp'),
    uglify = require('gulp-uglifyjs'),
    templateCache = require('gulp-angular-templatecache'),
    gulpif = require('gulp-if'),
    cleanhtml = require('gulp-cleanhtml'),
    livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var config = require('./config');
var _ENV_ = process.env.NODE_ENV || 'DEV';

gulp.task('build-angular-templates', function () {
    console.log(config);
    return gulp.src(config.templates.src)
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.write()))
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

gulp.task('build-angular-templates-watch', function () {
    gulp.watch(config.templates.src, ['build-angular-templates'])
});