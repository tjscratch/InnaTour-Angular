var gulp = require('gulp');
var stylus = require('gulp-stylus');
var shorthand = require('gulp-shorthand');
var cleanCSS = require('gulp-clean-css');

var nib = require('nib');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var config = require('./config');

var _ENV_ = process.env.NODE_ENV || 'DEV';

var distCss = './dist/spa/css';

/**
 *
 *
 *
 * BEGIN
 * Конкат css библиотек в один файл
 *
 *
 *
 *
 */
// для font-awesome необходимо скопировать папку с шрифтами, иначе не подгрузятся
// ./bower_components/font-awesome/fonts >> ./dist/spa/fonts
gulp.task('copy-font-font-awesome', function () {
    var srcUrl = './bower_components/font-awesome/fonts',
        distUrl = './dist/spa/fonts';
    gulp.src(srcUrl + '/**').pipe(gulp.dest(distUrl));
});
gulp.task('build-css-libs', ['copy-font-font-awesome'], function () {
    return gulp.src([
        './spa/lib/jquery-ui/jquery-ui.1.11.2.min.css',
        './bower_components/font-awesome/css/font-awesome.min.css',
        './bower_components/angular-ui-select/dist/select.min.css',
        './spa/lib/selectize/selectize.default.css',
        './spa/styl/components/jquery-ui-1.10.4.custom.css',
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('libs.css'))
        .pipe(shorthand())
        .pipe(cleanCSS({
                debug: true,
                compatibility: 'ie10'
            },
            function (details) {
                console.log(details.name + ' originalSize: ' + details.stats.originalSize);
                console.log(details.name + ' minifiedSize: ' + details.stats.minifiedSize);
            }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distCss));
});
/**
 *
 *
 *
 * END
 * Конкат css библиотек в один файл
 *
 *
 *
 *
 */

gulp.task('build-css', ['build-css-libs']);
