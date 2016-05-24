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
    var cssSrc   = config.dist.css + '/*.css',
        quoteSrc = config.dist.nodeApp.layouts + '/*.hbs',
        cssDst   = config.dist.css;


    return gulp.src(cssSrc)
        .pipe(md5(10, quoteSrc))
        .pipe(gulp.dest(cssDst));
});
