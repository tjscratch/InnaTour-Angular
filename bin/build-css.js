var gulp = require('gulp');
var stylus = require('gulp-stylus');
var shorthand = require('gulp-shorthand');
var cleanCSS = require('gulp-clean-css');
var nib = require('nib');

var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var config = require('./config');

var _ENV_ = process.env.NODE_ENV || 'DEV';


var distCss = './dist/spa/css';

/**
 *
 * BEGIN
 * Конкат css библиотек в один файл
 *
 */

//для font-awesome необходимо скопировать папку с шрифтами, иначе не подгрузятся
//./bower_components/font-awesome/fonts >> ./dist/spa/fonts
gulp.task('copy-font-font-awesome', function () {
    var srcUrl = './bower_components/font-awesome/fonts',
        distUrl = './dist/spa/fonts';
    gulp.src(srcUrl + '/**').pipe(gulp.dest(distUrl));
});

gulp.task('concat-styles-libs', ['copy-font-font-awesome'], function () {
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
 * END
 * Конкат css библиотек в один файл
 *
 */


/**
 *
 * BEGIN
 * Сборка ie.css
 *
 */
gulp.task('build-styles-ie', function () {
    var srcIeStyl = './spa/styl/ie.styl';
    return gulp.src(srcIeStyl)
        .pipe(sourcemaps.init())
        .pipe(stylus({
            use: [nib()],
            compress: (_ENV_ === 'production') ? true : false
        }))
        .pipe(shorthand())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distCss));
});
/**
 *
 * END
 * Сборка ie.css
 *
 */


/**
 *
 * BEGIN
 * Сборка основного css файла
 *
 */
var srcAdv = './spa/js/components/adv/**/*.styl',
    srcComponents = './spa/js/components/**/*.styl',
    srcPages = './spa/js/pages/**/*.styl',
    srcRegions = './spa/js/regions/**/*.styl',
    srcCommon = './spa/styl/common.styl',
    distCssTemp = './spa/styl/temp';

gulp.task('concat-styles-components', function () {
    return gulp.src(['!' + srcAdv, srcComponents])
        .pipe(concat('components.styl'))
        .pipe(gulp.dest(distCssTemp));
});

gulp.task('concat-styles-pages', function () {
    return gulp.src(srcPages)
        .pipe(concat('pages.styl'))
        .pipe(gulp.dest(distCssTemp));
});

gulp.task('concat-styles-regions', function () {
    return gulp.src(srcRegions)
        .pipe(concat('regions.styl'))
        .pipe(gulp.dest(distCssTemp));
});


gulp.task('build-styles-common', ['concat-styles-components', 'concat-styles-pages', 'concat-styles-regions'], function () {
    return gulp.src(srcCommon)
        .pipe(sourcemaps.init())
        .pipe(stylus({
            use: [nib()]
        }))
        .pipe(cleanCSS({
                debug: true,
                compatibility: 'ie9'
            },
            function (details) {
                console.log(details.name + ' originalSize: ' + details.stats.originalSize);
                console.log(details.name + ' minifiedSize: ' + details.stats.minifiedSize);
            }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distCss));
});

// копирование шрифтов
gulp.task('copy-fonts', function () {
    var srcUrl = './spa/fonts',
        distUrl = './dist/spa/fonts';
    gulp.src(srcUrl + '/**').pipe(gulp.dest(distUrl));
});

/**
 *
 * END
 * Сборка основного css файла
 *
 */

gulp.task('build-css', function (callback) {
    runSequence(
        'concat-styles-libs',
        'build-styles-ie',
        'build-styles-common',
        'copy-fonts',
        callback
    )
});
