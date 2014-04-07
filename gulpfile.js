var gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
	minifyCSS = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	stylus = require('gulp-stylus');

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
    gulp.src(['spa/styl/search.styl', 'spa/styl/datepicker.styl', 'spa/styl/results.styl', 'spa/styl/buy.styl', 'spa/styl/balloon.styl'])
		.pipe(concat('tickets.min.styl'))
		.pipe(stylus({
            use: ['nib'],
            import: ['nib']
        }))
		.pipe(minifyCSS(opts))
        .pipe(gulp.dest('spa/css'));
});

gulp.task('default', ['build-less']);

gulp.task('grundiss', function(){
    console.log(123);
});

//gulp.watch('spa/js/angular/**/*.coffee', )