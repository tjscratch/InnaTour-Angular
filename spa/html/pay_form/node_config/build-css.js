var gulp   = require('gulp'),
    size   = require('gulp-size'),
    stylus = require('gulp-stylus'),
    concat = require('gulp-concat'),
    nib    = require('nib'),
    conf   = require('./config');


var optStyl = {
    use: [nib()],
    compress: true,
    define: {'math-random': 123}
};

gulp.task('build-css', function () {
    return gulp.src(conf.css)
        .pipe(stylus(optStyl))
        .pipe(concat('base.css'))
        .pipe(gulp.dest(conf.build.css))
        .pipe(size({title: 'размер файла стилей -----------------------------'}));
});