var gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less');

// Compiles LESS > CSS 
gulp.task('build-less', function () {
    return gulp.src('/spa/css/main.less')
        .pipe(less())
        .pipe(gulp.dest('/spa/css'));
});

gulp.task('default', ['build-less']);