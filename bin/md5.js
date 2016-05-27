var gulp = require('gulp');
var md5 = require("gulp-md5-plus");
var imagemin = require('gulp-imagemin');
var config = require('./config');


gulp.task('md5-img', function () {
    return gulp.src(config.images.src)
        .pipe(imagemin())
        .pipe(md5(10, config.styles.distSrcMd5))
        .pipe(gulp.dest(config.images.distSrc));
});

gulp.task('md5-css', function () {
    return gulp.src(config.styles.distSrcMd5)
        .pipe(md5(10, config.nodeApp.distLayouts))
        .pipe(gulp.dest(config.styles.distSrc));
});

gulp.task('build-angular-templates-md5', function () {
    return gulp.src(config.templates.distSrcMd5)
        .pipe(md5(10, config.nodeApp.distLayouts))
        .pipe(gulp.dest(config.templates.distSrc));
});
