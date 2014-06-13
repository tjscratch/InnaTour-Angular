var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    htmlreplace = require('gulp-html-replace'),
    conf = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

// смотрим на окружение и подставляем нужные хосты
var apiHost = (_ENV_ !== 'production') ? conf.hosts.api.prod : conf.hosts.api.test;
var b2bHost = (_ENV_ === 'production') ? conf.hosts.b2b.prod : conf.hosts.b2b.test;


// Копируем в папку publish
gulp.task('replace-index', function () {
    return gulp.src('./index.html')
        .pipe(htmlreplace({
            'app-main-js': conf.build + '/js/app-main.js',
            'app-host': 'app_main.host = \'' + apiHost + '\';',
            'b2b-host': 'app_main.b2bHost = \'' + b2bHost + '\';'
        }))
        .pipe(gulp.dest(conf.publish));
});


// Копируем в папку publish/tours
gulp.task('release-tours', function () {
    return gulp.src('./tours/index.html')
        .pipe(htmlreplace({
            'app-main-js': conf.build + '/js/app-main.js',
            'app-host': 'app_main.host = \'' + apiHost + '\';',
            'b2b-host': 'app_main.b2bHost = \'' + b2bHost + '\';'
        }))
        .pipe(gulp.dest(conf.publish + '/tours'));
});



gulp.task('html-replace', ['replace-index', 'release-tours']);