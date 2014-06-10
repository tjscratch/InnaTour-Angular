var gulp = require('gulp'),
    less = require('gulp-less'),
    stylus = require('gulp-stylus'),
    minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    nib = require('nib');

var _ENV_ = process.env.NODE_ENV;

gulp.task('styles', function () {

    var optStyl = {
        use: ['nib'],
        import: ['nib']
    };

    gulp.src([__BUILD_FOLDER__ + '/spa/styl/ie.styl'])
        .pipe(stylus(optStyl))
        .pipe(concat('ie.min.css'))
        .pipe(gulp.dest('build/css'));

    gulp.src([__BUILD_FOLDER__ + '/spa/styl/ticket.styl'])
        .pipe(stylus(optStyl))
        .pipe(concat('ticket.min.css'))
        .pipe(gulp.dest('build/css'));

    gulp.src([__BUILD_FOLDER__ + '/spa/css/main/*.less', 'css/pages/*.less'])
        .pipe(concat('main.css'))
        .pipe(less())
        .pipe(gulp.dest('build/css'));

    return  gulp.src([__BUILD_FOLDER__ + '/spa/styl/common.styl'])
        .pipe(stylus(optStyl))
        .pipe(concat('common.min.css'))
        .pipe(gulp.dest('build/css'));


});


gulp.task('print', function () {
    gulp.src(['styl/print.styl'])
        .pipe(stylus({
            use: ['nib'],
            import: ['nib']
        }))
        .pipe(concat('print.css'))
        .pipe(gulp.dest('build/css'));
});