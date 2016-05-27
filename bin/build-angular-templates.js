var gulp = require('gulp'),
    uglify = require('gulp-uglifyjs'),
    templateCache = require('gulp-angular-templatecache'),
    gulpif = require('gulp-if'),
    cleanhtml = require('gulp-cleanhtml'),
    livereload = require('gulp-livereload');

var config = require('./config');


gulp.task('build-angular-templates', function () {
    console.log(config);
    return gulp.src(config.templates.src)
        .pipe(cleanhtml())
        .pipe(templateCache({
            module: config.templates.angularModuleName
        }))
        .pipe(uglify({
            mangle: true,
            compress: true,
            output: {
                beautify: false
            }
        }))
        .pipe(gulp.dest(config.templates.distSrc));
});

gulp.task('build-angular-templates-watch', function () {
    gulp.watch(config.templates.src, ['build-angular-templates'])
});