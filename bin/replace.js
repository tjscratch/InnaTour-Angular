var gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    htmlreplace = require('gulp-html-replace'),
    replace     = require('gulp-replace-task'),
    uglify      = require('gulp-uglifyjs'),
    config        = require('./config'),
    Q           = require('q');

var _ENV_ = process.env.NODE_ENV || '';
var __PROTOCOL__ = (_ENV_ === 'production') ? config.protocol.https : config.protocol.http;


// смотрим на окружение и подставляем нужные хосты
var apiHost = (_ENV_ === 'production') ? config.hosts.api.prod : ((_ENV_ === 'beta') ? config.hosts.api.beta : config.hosts.api.test);
var b2bHost = (_ENV_ === 'production') ? config.hosts.b2b.prod : ((_ENV_ === 'beta') ? config.hosts.b2b.beta : config.hosts.b2b.test);
var b2bHostSputnik = (_ENV_ === 'production') ? config.hosts.b2bSputnik.prod : ((_ENV_ === 'beta') ? config.hosts.b2bSputnik.beta : config.hosts.b2bSputnik.test);
var b2bPartnerHost = (_ENV_ === 'production') ? config.hosts.b2bPartner.prod : ((_ENV_ === 'beta') ? config.hosts.b2bPartner.beta : config.hosts.b2bPartner.test);
var frontHost = (_ENV_ === 'production') ? config.hosts.front.prod : ((_ENV_ === 'beta') ? config.hosts.front.beta : config.hosts.front.test);
var staticHost = (_ENV_ === 'production') ? config.hosts.static.prod : ((_ENV_ === 'beta') ? config.hosts.static.beta : config.hosts.static.test);
var partnersHost = (_ENV_ === 'production') ? config.hosts.partners.prod : ((_ENV_ === 'beta') ? config.hosts.partners.beta : config.hosts.partners.test);
var port = (_ENV_ === 'production') ? config.hosts.port.prod : ((_ENV_ === 'beta') ? config.hosts.port.beta : config.hosts.port.test);


gulp.task('replace-partners', function () {
    return gulp.src('./spa/js/partners/module.js')
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
        .pipe(gulp.dest(config.js.distSrc + config.partners_version));
});

gulp.task('replace-config', function () {

    var r = {
        patterns: [
            {
                json: {
                    'api_host': apiHost,
                    'b2b_host': b2bHost,
                    'b2b_host_sputnik': b2bHostSputnik,
                    'b2bPartnerHost': b2bPartnerHost,
                    'front_host': frontHost,
                    'static_host': staticHost,
                    'tripadvisor': (__PROTOCOL__ + config.tripadvisor)
                }
            }
        ]
    };

    return gulp.src('./spa/js/config.js')
        .pipe(replace(r))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', uglify({
            mangle: false
        })))
        .pipe(gulp.dest(config.js.distSrc));
});


//Конфиг для api запросов ноды
gulp.task('replace-node-config', function (cb) {
    setTimeout(function () {
        gulp.src('./node-app/config/config.json')
            .pipe(replace({
                patterns: [
                    {
                        match: 'api_host',
                        replacement: apiHost
                    },
                    {
                        match: 'port',
                        replacement: port
                    }
                ]
            }))
            .pipe(gulp.dest('./node-app/config'));
        cb();
    }, 1000);
});


gulp.task('replace', [
    'replace-partners',
    'replace-config',
    'replace-node-config'
]);
