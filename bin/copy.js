var gulp = require('gulp');
var config = require('./config');

gulp.task('copy-node-app', function () {
    gulp.src(config.nodeApp.src).pipe(gulp.dest(config.nodeApp.distSrc));
});

gulp.task('copy-js', function () {
    gulp.src('./spa/lib/if-browser.js').pipe(gulp.dest(config.js.distSrc));
    gulp.src('./spa/js/partners/partners.js').pipe(gulp.dest(config.js.distSrc));
    gulp.src('./spa/partners/**').pipe(gulp.dest('./dist/spa/partners'));
    gulp.src('./spa/*.css').pipe(gulp.dest('./dist/spa'));
    gulp.src('./spa/*.docx').pipe(gulp.dest('./dist/spa'));
    gulp.src('./spa/*.html').pipe(gulp.dest('./dist/spa'));
    gulp.src('./spa/wl-test/**/*').pipe(gulp.dest('./dist/spa/wl-test'));

    gulp.src('./spa/templates/pages/**/*.html').pipe(gulp.dest('./dist/spa/templates/pages'));
    gulp.src('./spa/google67180e948d7278f4.html').pipe(gulp.dest('./dist'));
});

gulp.task('copy-img', function () {
    gulp.src(config.images.src).pipe(gulp.dest(config.images.distSrc));
});

gulp.task('copy-lk', function () {
    gulp.src(config.lk.src).pipe(gulp.dest(config.lk.distSrc));
    gulp.src("./spa/lib/ui-bootstrap-typeahead-custom/typeahead.js").pipe(gulp.dest(config.lk.distSrc));
});

gulp.task('copy-js-watch', function () {
    gulp.watch('./spa/wl-test/**/*', ['copy-js']);
    gulp.watch('./spa/LK/*.html', ['copy-lk']);
});
