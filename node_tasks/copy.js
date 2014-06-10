var gulp = require('gulp');
var gulpif = require('gulp-if');
var conf = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

gulp.task('copy-project', function () {
    gulp.src(['./index.html', './web.config', './closer.html']).pipe(gulp.dest(conf.publish));

    gulp.src('build/**/*').pipe(gulp.dest(conf.publish));
    gulp.src('spa/**/*').pipe(gulp.dest(conf.publish));

    gulp.src('./tours/**/*').pipe(gulp.dest(conf.publish + '/tours'));


});
