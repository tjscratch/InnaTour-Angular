var gulp = require('gulp'),
    clean = require('gulp-clean');

var _ENV_ = process.env.NODE_ENV;

gulp.task('test-clean', function () {
    return  gulp.src('./publish', {read: false})
        .pipe(clean());
})
