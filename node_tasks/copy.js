var gulp = require('gulp');
var gulpif = require('gulp-if');
var flatten = require('gulp-flatten');
var conf = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

// Копируем в папаку publish
gulp.task('copy-project', function () {

    gulp.src(['./Web.config']).pipe(gulp.dest(conf.publish));
    gulp.src(['./Web.config']).pipe(gulp.dest(conf.publish+'/build/css'));
    gulp.src(['./Web.config']).pipe(gulp.dest(conf.publish+'/build/js'));


    gulp.src(['./browser.html']).pipe(gulp.dest(conf.publish));

    gulp.src(conf.build + '/**').pipe(gulp.dest(conf.publish + '/build'));
    gulp.src(conf.dest +'/**').pipe(gulp.dest(conf.publish + '/spa'));

    gulp.src('./tours/web.config').pipe(gulp.dest(conf.publish + '/tours'));

});
