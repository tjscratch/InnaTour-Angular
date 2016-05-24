var gulp = require('gulp');
var md5 = require("gulp-md5-plus");
var imagemin = require('gulp-imagemin');
var config = require('./config');


gulp.task('md5-img', function () {
    var imgSrc   = './spa/img/**',
        quoteSrc = config.dist.css + '/*.css',
        imgDst   = config.dist.img;

    return gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(md5(10, quoteSrc))
        .pipe(gulp.dest(imgDst));
});

gulp.task('md5-css', function () {
    return gulp.src(config.dist.css + '/*.css')
        .pipe(md5(10, config.dist.nodeApp.layouts + '/index.hbs'))
        .pipe(gulp.dest(config.dist.css));
});
