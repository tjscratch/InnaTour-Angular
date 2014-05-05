var gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
	minifyCSS = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	stylus = require('gulp-stylus'),
    nib = require('nib');


var paths = {
    styles: 'spa/styl/**/*'
};


// Compiles LESS > CSS 
gulp.task('build-less', function () {
    return gulp.src('spa/css/main/main.less')
        .pipe(less())
        .pipe(gulp.dest('spa/css'));
});

gulp.task('build-ticket', function () {
    return gulp.src('spa/css/ticket.less')
        .pipe(less())
        .pipe(gulp.dest('spa/css'));
});

gulp.task('build-styl', function () {
    gulp.src([
            'spa/styl/main.styl'
        ])
		.pipe(concat('styles.min.styl'))
            .on('error', function() {})
		.pipe(stylus())
            .on('error', function() {})
//		.pipe(minifyCSS({
//            keepBreaks: true
//        }))
//            .on('error', function() {})
        .pipe(gulp.dest('spa/css'))
            .on('error', function() {})
});

gulp.task('watch', function() {
    gulp.watch(paths.styles, ['build-styl']);
});


gulp.task('default', ['build-less']);