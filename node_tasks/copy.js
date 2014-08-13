var gulp = require('gulp');
var gulpif = require('gulp-if');
var conf = require('./config');

var _ENV_ = process.env.NODE_ENV || '';


// Копируем в папаку publish
gulp.task('copy-project', function () {
    var build = '/' + conf.version;

    gulp.src(['./favicon.ico']).pipe(gulp.dest(conf.publish));
    gulp.src(['./Web.config']).pipe(gulp.dest(conf.publish));

    gulp.src(conf.build + '/**').pipe(gulp.dest(conf.publish + build));

    gulp.src(['./Web.config']).pipe(gulp.dest(conf.publish + build + '/css'));

    gulp.src(['./Web.config']).pipe(gulp.dest(conf.publish + build + '/js'));


    gulp.src([conf.dest + '/**', '!' + conf.dest + '/browser.html']).pipe(gulp.dest(conf.publish + '/spa'));

    //gulp.src([conf.publish + '/browser.html']).pipe(gulp.dest(conf.publish + '/spa'));

    gulp.src('./tours/web.config').pipe(gulp.dest(conf.publish + '/tours'));
});
