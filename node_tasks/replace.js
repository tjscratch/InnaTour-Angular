var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    htmlreplace = require('gulp-html-replace'),
    conf = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

// смотрим на окружение и подставляем нужные хосты
var apiHost = (_ENV_ === 'production') ? conf.hosts.api.prod : conf.hosts.api.test;
var b2bHost = (_ENV_ === 'production') ? conf.hosts.b2b.prod : conf.hosts.b2b.test;
var apiFrontHost = (_ENV_ === 'production') ? conf.hosts.front.prod : conf.hosts.front.test;
var staticHost = (_ENV_ === 'production') ? conf.hosts.static.prod : conf.hosts.static.test;

var __PROTOCOL__ = (_ENV_ === 'production') ? conf.protocol.https : conf.protocol.http;

function getConfReplace(){
    return {
        'app-main-js': '/'+ conf.version +'/js/app-main.js',
        'app-less': '/'+ conf.version +'/css/main.less.css',
        'app-stylus': '/'+ conf.version +'/css/common.min.css',

        'app-host': 'app_main.host = \'' + apiHost + '\';',
        'b2b-host': 'app_main.b2bHost = \'' + b2bHost + '\';',
        'front-host': 'app_main.frontHost = \'' + apiFrontHost + '\';',
        'static-host': 'app_main.staticHost = \'' + staticHost + '\';',
        'tripadvisor': 'app_main.tripadvisor = \'' + __PROTOCOL__ + conf.tripadvisor + '\';'
    }
}

// Копируем в папку publish
gulp.task('replace-index', function () {
    return gulp.src('./index.html')
        .pipe(htmlreplace(getConfReplace()))
        .pipe(gulp.dest(conf.publish));
});

gulp.task('replace-browser', function () {
    return gulp.src('./spa/browser.html')
        .pipe(htmlreplace(getConfReplace()))
        .pipe(gulp.dest(conf.publish + '/spa'));
});


// Копируем в папку publish/tours
gulp.task('release-tours', function () {
    return gulp.src('./tours/index.html')
        .pipe(htmlreplace(getConfReplace()))
        .pipe(gulp.dest(conf.publish + '/tours'));
});


gulp.task('html-replace', ['replace-index', 'release-tours', 'replace-browser']);