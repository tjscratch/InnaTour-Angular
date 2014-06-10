var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    templateCache = require('gulp-angular-templatecache'),
    cleanhtml = require('gulp-cleanhtml');

var _ENV_ = process.env.NODE_ENV;

gulp.task('templates-ang', function () {
    return gulp.src([
        '/spa/templates/**/*.html',
        '/spa/js/angular/**/*.html'
    ])
        .pipe(cleanhtml())
        .pipe(templateCache({
            module: 'innaApp.templates'
        }))
        .pipe(uglify({
            mangle: false,
            output: {
                beautify: true
            }
        }))
        .pipe(gulp.dest('build'));
});
