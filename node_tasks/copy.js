var gulp = require('gulp');
var gulpif = require('gulp-if');
var flatten = require('gulp-flatten');
var conf = require('./config');
var fs = require('fs');
var Q = require('q');

var _ENV_ = process.env.NODE_ENV || '';

var renameBuild = {
    basename: Math.random(1000).toString(16),
    prefix: "build-",
    suffix: "-" + Math.random(1000).toString(32)
};

var cacheNameBuild = renameBuild.prefix + renameBuild.basename +   renameBuild.suffix;



// Копируем в папаку publish
gulp.task('copy-project', function () {

    gulp.src(conf.build + '/**').pipe(gulp.dest(conf.publish + '/build'));
    gulp.src(['./favicon.ico']).pipe(gulp.dest(conf.publish));
    gulp.src(['./Web.config']).pipe(gulp.dest(conf.publish));
    gulp.src(['./Web.config']).pipe(gulp.dest(conf.publish+'/build/css'));
    gulp.src(['./Web.config']).pipe(gulp.dest(conf.publish+'/build/js'));

    gulp.src(conf.dest +'/**').pipe(gulp.dest(conf.publish + '/spa'));

    gulp.src(['./browser.html']).pipe(gulp.dest(conf.publish+'/spa'));

    gulp.src('./tours/web.config').pipe(gulp.dest(conf.publish + '/tours'));

});
