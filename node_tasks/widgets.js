var gulp          = require('gulp'),
    uglify        = require('gulp-uglifyjs'),
    stylus        = require('gulp-stylus'),
    concat        = require('gulp-concat'),
    gulpif        = require('gulp-if'),
    templateCache = require('gulp-angular-templatecache'),
    cleanhtml     = require('gulp-cleanhtml'),
    conf          = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

/**
 * STYLUS
 * gulp widget-search-stylus
 */
gulp.task('widget-search-stylus', function () {
    return gulp.src([conf.widgets + '/search/css/inna-search-widget.styl'])
        .pipe(stylus({
            compress: (_ENV_ === 'production' || _ENV_ === 'beta') ? true : false,
            define: {'math-random': 123}
        }))
        .pipe(gulp.dest(conf.widgets + '/search/build'))
});
/**
 * STYLUS
 * gulp build-lk-stylus
 */
gulp.task('build-lk-stylus', function () {
    return gulp.src([conf.dest + '/html/LK/css/lk.styl'])
        .pipe(stylus())
        .pipe(concat('lk.css'))
        .pipe(gulp.dest(conf.dest + '/html/LK/css'))
});


/**
 * ANGULAR TEMPLATE CACHE
 */
gulp.task('widget-search-template', function () {
    return gulp.src([
        conf.widgets + '/search/templ/*.html'
    ])
        .pipe(cleanhtml())
        .pipe(templateCache({
            module: 'innaTemplates'
        }))
        .pipe(uglify({
            mangle: false,
            output: {
                beautify: true
            }
        }))
        .pipe(gulp.dest(conf.widgets + '/search/build'))
});


/**
 * JS CONCAT
 */
gulp.task('widget-search-js', ['widget-search-template'], function () {
    return gulp.src([
        conf.dest + '/lib/ui-bootstrap/ui-bootstrap-custom-0.12.0.js',
        conf.dest + '/lib/ui-bootstrap/ui-bootstrap-custom-tpls-0.12.0.js',
        conf.dest + '/lib/bootstrap-datepicker/bootstrap-datepicker.min.js',
        conf.dest + '/lib/bootstrap-datepicker/bootstrap-datepicker.ru.min.js',
        conf.widgets + '/search/js/app.js',
        conf.widgets + '/search/js/directives.js',
        conf.widgets + '/search/js/form.js',
        conf.widgets + '/search/js/validation.js',
        conf.widgets + '/search/build/templates.js'
    ])
        .pipe(concat('inna-search-widget.js'))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', uglify({
            mangle: false,
            outSourceMap: true
        })))
        .pipe(gulp.dest(conf.widgets + '/search/build'));
});
/**
 * WATCHERS
 * gulp build-lk-watch
 */
gulp.task('build-lk-watch', function () {
    gulp.watch(conf.dest + '/html/LK/css/*.styl', ['build-lk-stylus'])
        .on('change', function (file) {
        });
})


/**
 * WATCHERS
 * gulp widget-search-watch
 */
gulp.task('widget-search-watch', function () {
    gulp.watch(conf.widgets + '/search/**/*.styl', ['widget-search-stylus'])
        .on('change', function (file) {

        });
    gulp.watch([
        conf.widgets + '/search/js/*.js',
        conf.widgets + '/search/templ/*.html'
    ], ['widget-search-js']);

})


/**
 * сборка поискового виджета
 */
gulp.task('widget-search', [
    'widget-search-stylus',
    'build-lk-stylus',
    'widget-search-js',
]);