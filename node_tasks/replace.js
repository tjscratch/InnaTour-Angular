var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    htmlreplace = require('gulp-html-replace'),
	uglify = require('gulp-uglifyjs'),
    conf = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

// смотрим на окружение и подставляем нужные хосты
var apiHost = (_ENV_ === 'production') ? conf.hosts.api.prod : ((_ENV_ === 'beta') ? conf.hosts.api.beta : conf.hosts.api.test);
var b2bHost = (_ENV_ === 'production') ? conf.hosts.b2b.prod : ((_ENV_ === 'beta') ? conf.hosts.b2b.beta : conf.hosts.b2b.test);
var apiFrontHost = (_ENV_ === 'production') ? conf.hosts.front.prod : ((_ENV_ === 'beta') ? conf.hosts.front.beta : conf.hosts.front.test);
var staticHost = (_ENV_ === 'production') ? conf.hosts.static.prod : ((_ENV_ === 'beta') ? conf.hosts.static.beta : conf.hosts.static.test);

var __PROTOCOL__ = (_ENV_ === 'production') ? conf.protocol.https : conf.protocol.http;

function getConfReplace(){
    return {
        'app-config-debug' : '<script>window.FrontedDebug = false;</script>',

        'app-config-js': '/'+ conf.version +'/js/config.js',
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
gulp.task('replace-config', function () {
    return gulp.src(conf.angular + '/config.js')
        .pipe(htmlreplace(getConfReplace()))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', uglify({
            mangle: false,
            outSourceMap: true
        })))
        .pipe(gulp.dest(conf.build + '/js'));
});

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


gulp.task('replace-HTML', function () {
    return gulp.src([
            conf.dest + '/html/**/*.html',
            conf.dest + '/html2/**/*.html'
    ])
        .pipe(htmlreplace(getConfReplace()))
        .pipe(gulp.dest(conf.publish + '/spa/html'));
});


// Копируем в папку publish/tours
gulp.task('release-tours', function () {
    return gulp.src('./tours/index.html')
        .pipe(htmlreplace(getConfReplace()))
        .pipe(gulp.dest(conf.publish + '/tours'));
});


gulp.task('html-replace', ['replace-index', 'release-tours', 'replace-browser', 'replace-HTML']);