var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    less = require('gulp-less'),
    gulpif = require('gulp-if'),
    conf = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

gulp.task('less', function () {

    gulp.src(conf.dest +'/less/main/*.css').pipe(gulp.dest(conf.build +'/css'));

    return gulp.src([
            conf.dest +'/less/main/*.less',
            conf.dest +'/less/pages/*.less'
    ])
        .pipe(concat('main.less.css'))
        .pipe(less())
        .pipe(gulpif(_ENV_ === 'production', minifyCSS()))
        .pipe(gulp.dest(conf.build +'/css'));
});

