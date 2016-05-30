var gulp = require('gulp');
var config = require('./config');

var srcNodeApp = './node-app/**';
var distNodeApp = './dist/node-app';

var srcImg = './spa/img/**';
var distImg = './dist/spa/img';

gulp.task('copy-node-app', function () {
    gulp.src(srcNodeApp).pipe(gulp.dest(distNodeApp));
});

gulp.task('copy-js', function () {
    gulp.src('./spa/lib/if-browser.js').pipe(gulp.dest(config.js.distSrc));
    gulp.src('./spa/js/partners/partners.js').pipe(gulp.dest(config.js.distSrc));
});

gulp.task('copy-img', function () {
    gulp.src(srcImg).pipe(gulp.dest(distImg));
});