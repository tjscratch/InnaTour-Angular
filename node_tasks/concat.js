var gulp = require('gulp');
var concat = require('gulp-concat');

var _ENV_ = process.env.NODE_ENV;

gulp.task('test-concat', function () {
    return gulp.src([
        '/spa/js/angular/helpers/*.js',
        '/spa/js/datepicker.js',
        '/spa/js/angular/models/app.model.js',
        '/spa/js/angular/models/*.js',
        '/spa/js/angular/**/*.js'
    ])
        .pipe(concat('app-main.js'))
        .pipe(gulp.dest('build'));
});

