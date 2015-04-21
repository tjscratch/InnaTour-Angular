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
    gulp.src(conf.bower + '/**').pipe(gulp.dest(conf.publish + '/bower_components'));

    gulp.src(['./Web.config']).pipe(gulp.dest(conf.publish + build + '/css'));

    gulp.src(['./Web.config']).pipe(gulp.dest(conf.publish + build + '/js'));


    gulp.src([
        '!' + conf.dest + '/browser.html',
        '!' + conf.dest + '/html/**',
        '!' + conf.dest + '/html2/**',
        conf.dest + '/**'
    ])
        .pipe(gulp.dest(conf.publish + '/spa'));

    //gulp.src([conf.publish + '/browser.html']).pipe(gulp.dest(conf.publish + '/spa'));

    gulp.src('./tours/web.config').pipe(gulp.dest(conf.publish + '/tours'));
    gulp.src(conf.build + '/widgets/**').pipe(gulp.dest(conf.publish + '/spa/widgets'));
});


// Копируем в папаку publish
//gulp.task('copy-backend', function () {
//    gulp.src('./backend/**').pipe(gulp.dest(conf.publish + '/backend'));
//    gulp.src('./package.json').pipe(gulp.dest(conf.publish));
//});

// Копируем в папаку publish
gulp.task('copy-node-app', function () {
    gulp.src('./node-app/**').pipe(gulp.dest(conf.publish + '/node-app'));
    gulp.src('./package.json').pipe(gulp.dest(conf.publish));
});
