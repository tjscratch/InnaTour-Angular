var gulp          = require('gulp'),
    uglify        = require('gulp-uglifyjs'),
    stylus        = require('gulp-stylus'),
    concat        = require('gulp-concat'),
    gulpif        = require('gulp-if'),
    templateCache = require('gulp-angular-templatecache'),
    cleanhtml     = require('gulp-cleanhtml'),
    config          = require('./config');

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
            mangle: false,
            outSourceMap: false
        })))
        .pipe(gulp.dest('./dist/spa/js/widgets/search'));
});


gulp.task('widget-search-js', ['widget-search-template', 'widget-search-config'], function () {
    return gulp.src(config.widget.libsSrc)
        .pipe(concat('inna-search-widget.js'))
        .pipe(uglify({
            mangle: false,
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



/**
 * сборка поискового виджета
 */
gulp.task('widget-search', [
    'widget-search-stylus',
    'widget-search-js'
]);