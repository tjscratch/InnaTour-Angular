var gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less');

var _ENV_ = process.env.NODE_ENV;

gulp.task('styles', function () {
    return gulp.src([__BUILD_FOLDER__ + '/spa/css/main/*.less', 'css/pages/*.less'])
        .pipe(concat('main.css'))
        .pipe(less())
        .pipe(gulp.dest('build/css'));
});

