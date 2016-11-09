var gulp = require('gulp');
var stylus = require('gulp-stylus');
var cleanCSS = require('gulp-clean-css');
var nib = require('nib');

var gulpif = require('gulp-if');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var config = require('./config');



var env = process.env.NODE_ENV;
if (env === 'production' || env === 'test' || env === 'beta') {
    var _ENV_ = 'production'
}else{
    var _ENV_ = 'DEV'
}


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
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.init()))
        .pipe(concat('libs.css'))
        .pipe(cleanCSS({
                debug: true,
                compatibility: 'ie10'
            },
            function (details) {
                console.log(details.name + ' originalSize: ' + details.stats.originalSize);
                console.log(details.name + ' minifiedSize: ' + details.stats.minifiedSize);
            }))
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.write()))
        .pipe(gulp.dest(config.styles.distSrc));
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
 * Сборка основного css файла
 *
 */
var srcAdv = './spa/js/adv/css/*.styl',
    distAdv = './dist/spa/css',
    srcCommon = './spa/styl/common.styl';

gulp.task('build-styles-adv', function () {
    return gulp.src(srcAdv)
        .pipe(stylus({use: [nib()]}))
        .pipe(cleanCSS())
        .pipe(gulp.dest(distAdv));
});

gulp.task('build-styles-common', function () {
    return gulp.src(srcCommon)
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.init()))
        .pipe(stylus({
            use: [nib()]
        }))
        .pipe(gulpif(_ENV_ === 'production', cleanCSS({
                debug: true,
                compatibility: 'ie9'
            },
            function (details) {
                console.log(details.name + ' originalSize: ' + details.stats.originalSize);
                console.log(details.name + ' minifiedSize: ' + details.stats.minifiedSize);
            })))
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.write()))
        .pipe(gulp.dest(config.styles.distSrc));
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

/**
 *
 * BEGIN
 * Сборка ie.css
 *
 */
gulp.task('build-styles-ie', function () {
    var srcIeStyl = './spa/styl/ie.styl';
    return gulp.src(srcIeStyl)
        .pipe(stylus({
            use: [nib()],
            compress: (_ENV_ === 'production') ? true : false
        }))
        .pipe(gulp.dest(config.styles.distSrc));
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
 * Сборка всякой фигни
 *
 */
gulp.task('build-styles-ticket', function () {
    var srcUrl = './spa/styl/ticket.styl';
    return gulp.src(srcUrl)
        .pipe(stylus({use: [nib()]}))
        .pipe(concat('ticket.min.css'))
        .pipe(gulp.dest(config.styles.distSrc));
});
gulp.task('build-styles-print', function () {
    var srcUrl = './spa/styl/print.styl';
    return gulp.src(srcUrl)
        .pipe(stylus({use: [nib()]}))
        .pipe(concat('print.css'))
        .pipe(gulp.dest(config.styles.distSrc));
});
gulp.task('build-styles-partners', function () {
    return gulp.src(config.partners.css.src)
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.init()))
        .pipe(stylus({use: [nib()]}))
        .pipe(gulpif(_ENV_ === 'production', cleanCSS({
                debug: true,
                compatibility: 'ie9'
            },
            function (details) {
                console.log(details.name + ' originalSize: ' + details.stats.originalSize);
                console.log(details.name + ' minifiedSize: ' + details.stats.minifiedSize);
            })))
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.write()))
        .pipe(gulp.dest(config.partners.css.distSrc));
});
gulp.task('build-styles-partners-euroset', function () {
    var srcUrl = './spa/partners/euroset/assets/page.base.styl',
        distSrcPartners = './spa/partners/euroset/assets';
    return gulp.src(srcUrl)
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.init()))
        .pipe(stylus({use: [nib()]}))
        .pipe(gulpif(_ENV_ === 'production', cleanCSS({
                debug: true,
                compatibility: 'ie9'
            },
            function (details) {
                console.log(details.name + ' originalSize: ' + details.stats.originalSize);
                console.log(details.name + ' minifiedSize: ' + details.stats.minifiedSize);
            })))
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.write()))
        .pipe(gulp.dest(distSrcPartners));
});
gulp.task('build-styles-partners-rosneft', function () {
    var srcUrl = './spa/partners/rosneft/assets/page.base.styl',
        distSrcPartners = './spa/partners/rosneft/assets';
    return gulp.src(srcUrl)
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.init()))
        .pipe(stylus({use: [nib()]}))
        .pipe(gulpif(_ENV_ === 'production', cleanCSS({
                debug: true,
                compatibility: 'ie9'
            },
            function (details) {
                console.log(details.name + ' originalSize: ' + details.stats.originalSize);
                console.log(details.name + ' minifiedSize: ' + details.stats.minifiedSize);
            })))
        .pipe(gulpif(_ENV_ != 'production', sourcemaps.write()))
        .pipe(gulp.dest(distSrcPartners));
});
/**
 *
 * END
 * Сборка всякой фигни
 *
 */

gulp.task('build-css', function (callback) {
    runSequence(
        'concat-styles-libs',
        'build-styles-ie',
        'build-styles-common',
        'build-styles-ticket',
        'build-styles-print',
        'build-styles-partners',
        'build-styles-partners-euroset',
        'build-styles-partners-rosneft',
        'build-styles-adv',
        'copy-fonts',
        callback
    )
});


gulp.task('build-css-watch', function () {
    
    gulp.watch([
        './spa/styl/**/*.styl',
        './spa/js/components/**/*.styl',
        './spa/js/pages/**/*.styl',
        './spa/js/regions/**/*.styl',
        './spa/styl/partners/**/*.styl',
        '!./spa/styl/**/ticket.styl',
        '!./spa/styl/**/ie.styl',
        '!./spa/styl/**/print.styl'
    ], ['build-styles-common'])
        .on('change', function (file) {
            
        });
    
    gulp.watch(srcAdv, ['build-styles-adv'])
        .on('change', function (file) {
            
        });

    gulp.watch('./spa/styl/partners/**/*.styl', ['build-styles-partners'])
        .on('change', function (file) {
            
        });
});