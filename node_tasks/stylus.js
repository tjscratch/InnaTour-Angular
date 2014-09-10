var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    nib = require('nib'),
    /*asix = require('axis-css'),*/
    conf = require('./config'),
    sourcemaps = require('gulp-sourcemaps');

var _ENV_ = process.env.NODE_ENV || '';

var optStyl = {
    use: [nib()],
    define: { 'math-random': 123 }
};

var styleBase = process.env.PWD+'/spa/styl/base.styl';


/* простой конкат  */
gulp.task('styl-components', function () {
    return gulp.src([
            '!'+ conf.src + '/components/adv/**/*.styl',
            conf.src + '/components/**/*.styl'
    ])
        .pipe(concat('components.styl'))
        .pipe(gulp.dest(conf.styl + '/temp'))
});

gulp.task('styl-pages', function () {
    return gulp.src([conf.src + '/pages/**/*.styl'])
        .pipe(concat('pages.styl'))
        .pipe(gulp.dest(conf.styl + '/temp'))
});

gulp.task('styl-regions', function () {
    return gulp.src([conf.src + '/regions/**/*.styl'])
        .pipe(concat('regions.styl'))
        .pipe(gulp.dest(conf.styl + '/temp'))
});

/* \\\ простой конкат  */

// add sourcemap
gulp.task('styl-common', function () {

    optStyl.sourcemap = {inline: true};
    optStyl.import = styleBase;

    return gulp.src([conf.styl + '/common.styl'])
        .pipe(stylus(optStyl))
        .pipe(concat('common.min.css'))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', minifyCSS()))
        .pipe(gulp.dest(conf.build + '/css'))

        .on('end', function() {

        })

        .on('error', function(err) {
            if (!/tests? failed/.test(err.stack)) {
                console.log(err.stack);
            }
        });
});

gulp.task('styl-ticket', function () {
    return gulp.src([conf.styl + '/ticket.styl'])
        .pipe(stylus(optStyl))
        .pipe(concat('ticket.min.css'))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', minifyCSS()))
        .pipe(gulp.dest(conf.build + '/css'));

});

gulp.task('styl-ie', function () {
    return gulp.src([conf.styl + '/ie.styl'])
        .pipe(stylus(optStyl))
        .pipe(concat('ie.min.css'))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', minifyCSS()))
        .pipe(gulp.dest(conf.build + '/css'));
});


gulp.task('styl-print', function () {
    return gulp.src([conf.styl + '/print.styl'])
        .pipe(stylus(optStyl))
        .pipe(concat('print.css'))
        .pipe(gulpif(_ENV_ === 'production' || _ENV_ === 'beta', minifyCSS()))
        .pipe(gulp.dest(conf.build + '/css'));
});


gulp.task('styl-partners', function () {
    optStyl.import = styleBase;
    return gulp.src([conf.styl + '/partners/**/*.base.styl'])
		.pipe(stylus(optStyl))
        .pipe(gulp.dest(conf.styl + '/partners'));
});


/* ADV */
gulp.task('styl-adv', function () {
    optStyl.import = styleBase;
    return gulp.src([conf.src + '/components/adv/css/adv.base.styl'])
        .pipe(stylus(optStyl))
        .pipe(gulp.dest(conf.src + '/components/adv/css'));
});


gulp.task('styles-app', ['styl-components', 'styl-pages', 'styl-regions']);
gulp.task('styles', ['styl-common', 'styl-ticket', 'styl-ie', 'styl-print', 'styl-partners']);
