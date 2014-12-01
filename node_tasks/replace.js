var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    htmlreplace = require('gulp-html-replace'),
    replace = require('gulp-replace-task'),
    uglify = require('gulp-uglifyjs'),
    conf = require('./config'),
    manifest = require('./manifest');

var _ENV_ = process.env.NODE_ENV || '';


// смотрим на окружение и подставляем нужные хосты
var apiHost = (_ENV_ === 'production') ? conf.hosts.api.prod : ((_ENV_ === 'beta') ? conf.hosts.api.beta : conf.hosts.api.test);
var b2bHost = (_ENV_ === 'production') ? conf.hosts.b2b.prod : ((_ENV_ === 'beta') ? conf.hosts.b2b.beta : conf.hosts.b2b.test);
var b2bPartnerHost = (_ENV_ === 'production') ? conf.hosts.b2bPartner.prod : ((_ENV_ === 'beta') ? conf.hosts.b2bPartner.beta : conf.hosts.b2bPartner.test);
var frontHost = (_ENV_ === 'production') ? conf.hosts.front.prod : ((_ENV_ === 'beta') ? conf.hosts.front.beta : conf.hosts.front.test);
var staticHost = (_ENV_ === 'production') ? conf.hosts.static.prod : ((_ENV_ === 'beta') ? conf.hosts.static.beta : conf.hosts.static.test);
var partnersHost = (_ENV_ === 'production') ? conf.hosts.partners.prod : ((_ENV_ === 'beta') ? conf.hosts.partners.beta : conf.hosts.partners.test);

/*console.info(apiHost);
console.info(b2bHost);
console.info(frontHost);
console.info(staticHost);
console.info(partnersHost);*/

var __PROTOCOL__ = (_ENV_ === 'production') ? conf.protocol.https : conf.protocol.http;

function getConfReplace() {
    return {
        'app-config-debug': '<script>window.FrontedDebug = false;</script>',

        'app-config-js': '/' + conf.version + '/js/config.js',
        'app-main-js': '/' + conf.version + '/js/app-main.js',
        'bower_components': '/bower_components' + manifest["/bower-components.js"],
        'app-stylus': '/' + conf.version + '/css/common.min.css'
    }
}

// Копируем в папку publish
gulp.task('replace-partners', function () {
    return gulp.src(conf.src + '/partners/module.js')
        .pipe(replace({
            patterns: [
                {
                    match: 'partnersHost',
                    replacement: partnersHost
                }
            ]
        }))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', uglify({
            mangle: false
        })))
        .pipe(gulp.dest(conf.publish + '/spa/js/partners/' + conf.partners_version));
});

gulp.task('replace-config', function () {

    var r = {
        patterns: [
            {
                json: {
                    'api_host': apiHost,
                    'b2b_host': b2bHost,
                    'b2bPartnerHost': b2bPartnerHost,
                    'front_host': frontHost,
                    'static_host': staticHost,
                    'tripadvisor': (__PROTOCOL__ + conf.tripadvisor)
                }
            }
        ]
    };

    return gulp.src(conf.src + '/config.js')
        .pipe(replace(r))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', uglify({
            mangle: false
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