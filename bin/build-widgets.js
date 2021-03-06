var gulp = require('gulp'),
    uglify = require('gulp-uglifyjs'),
    stylus = require('gulp-stylus'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    templateCache = require('gulp-angular-templatecache'),
    cleanhtml = require('gulp-cleanhtml'),
    config = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

/**
 * STYLUS
 * gulp widget-search-stylus
 */
gulp.task('widget-search-stylus', function () {
    return gulp.src(config.widget.cssSrc)
        .pipe(stylus({
            compress: (_ENV_ === 'production' || _ENV_ === 'beta') ? true : false,
        }))
        .pipe(gulp.dest(config.widget.distSrc))
});


gulp.task('widget-offer-stylus', function () {
    return gulp.src('./spa/js/widgets/offer/css/*.styl')
        .pipe(stylus({
            compress: (_ENV_ === 'production' || _ENV_ === 'beta') ? true : false,
        }))
        .pipe(gulp.dest('./dist/spa/js/widgets/offer'));
});

gulp.task('lk-stylus', function () {
    return gulp.src('./spa/LK/css/lk.styl')
        .pipe(stylus({
            compress: (_ENV_ === 'production' || _ENV_ === 'beta') ? true : false,
        }))
        .pipe(gulp.dest('./dist/spa/LK/css'));
});


/**
 * ANGULAR TEMPLATE CACHE
 */
gulp.task('widget-search-template', function () {
    return gulp.src(config.widget.templSrc)
        .pipe(cleanhtml())
        .pipe(templateCache({
            module: 'innaApp.templates'
        }))
        .pipe(uglify({
            mangle: false,
            output: {
                beautify: true
            }
        }))
        .pipe(gulp.dest(config.widget.templDist))
});


/**
 * JS CONCAT
 */
gulp.task('widget-search-config', function () {
    return gulp.src([
        './spa/js/widgets/search/js/inna-search.js'
    ])
        .pipe(concat('inna-search.js'))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', uglify({
            mangle      : false,
            outSourceMap: false
        })))
        .pipe(gulp.dest('./dist/spa/js/widgets/search'));
});


gulp.task('widget-offer-config', function () {
    return gulp.src([
        './spa/js/widgets/offer/js/*.js',
        './bower_components/jquery/dist/jquery.min.js'
    ])
        .pipe(gulp.dest('./dist/spa/js/widgets/offer'));
});


gulp.task('widget-search-js', ['widget-search-template', 'widget-search-config'], function () {
    return gulp.src(config.widget.libsSrc)
        .pipe(concat('inna-search-widget.js'))
        .pipe(uglify({
            mangle      : false,
            outSourceMap: true
        }))
        .pipe(gulp.dest(config.widget.distSrc));
});

/**
 * WATCHERS
 * gulp widget-search-watch
 */
gulp.task('widget-search-watch', function () {
    gulp.watch('./spa/js/widgets/search/**/*.styl', ['widget-search-stylus'])
        .on('change', function (file) {
            
        });
    gulp.watch([
        './spa/js/widgets/search/js/*.js',
        './spa/js/widgets/search/templ/*.html'
    ], ['widget-search-js']);
});

gulp.task('widget-offer-watch', function () {
    gulp.watch('./spa/js/widgets/offer/css/*.styl', ['widget-offer-stylus'])
        .on('change', function (file) {
            
        });
    gulp.watch([
        './spa/js/widgets/offer/js/*.js',
    ], ['widget-offer-config']);
    gulp.watch([
        './spa/js/widgets/offer/js/*.js',
    ], ['widget-offer-config']);
});


gulp.task('lk-stylus-watch', function () {
    gulp.watch('./spa/LK/css/*.styl', ['lk-stylus'])
        .on('change', function (file) {
            
        });
});


/**
 * сборка поискового виджета
 */
gulp.task('widget-search', [
    'widget-search-stylus',
    'widget-search-js',
    'widget-offer-stylus',
    'widget-offer-config',
    'lk-stylus'
]);