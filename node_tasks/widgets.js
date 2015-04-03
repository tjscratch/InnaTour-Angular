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
 * ANGULAR TEMPLATE CACHE
 */
gulp.task('widget-search-template', function () {
    return gulp.src([
        conf.widgets + '/search/templ/*.html'
    ])
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
        .pipe(gulp.dest(conf.widgets + '/search/build'))
});


/**
 * JS CONCAT
 */
gulp.task('widget-search-config', function () {
    return gulp.src([
        conf.widgets + '/search/js/inna-search.js'
    ])
        .pipe(concat('inna-search.js'))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', uglify({
            mangle: false,
            outSourceMap: false
        })))
        .pipe(gulp.dest(conf.widgets + '/search'));
});


gulp.task('widget-search-js', ['widget-search-template', 'widget-search-config'], function () {
    return gulp.src([
        conf.bower + '/angular/angular.js',
        conf.bower + '/angular-sanitize/angular-sanitize.js',
        conf.dest + '/lib/ui-bootstrap-typeahead-custom/typeahead.js',
        conf.dest + '/lib/bootstrap-datepicker/bootstrap-datepicker.js',
        conf.dest + '/lib/bootstrap-datepicker/bootstrap-datepicker.ru.min.js',
        conf.widgets + '/search/js/app.js',
        conf.widgets + '/search/js/directives.js',
        conf.widgets + '/search/js/form.js',
        conf.widgets + '/search/js/validation.js',
        conf.widgets + '/search/js/filters.js',
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
    'widget-search-js'
]);