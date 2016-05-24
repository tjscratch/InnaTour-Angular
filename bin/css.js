var gulp = require('gulp');
var stylus = require('gulp-stylus');
var nib = require('nib');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var config = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

// console.log(_ENV_);


// gulp.task('build-css', function () {
// return gulp.src(config.styles.pages)
// return gulp.src("./spa/styl/common.styl")
// .pipe(stylus({ use: nib(), import: ['nib'] }))
// .pipe(stylus())
// .pipe(gulp.dest(config.dist.css));
// });

gulp.task('build-css-ie', function () {
    return gulp.src(config.styles.ie)
        .pipe(sourcemaps.init())
        .pipe(stylus({
            use: nib(),
            import: ['nib'],
            compress: (_ENV_ === 'production' || _ENV_ === 'beta') ? true : false
        }))
        .pipe(concat('ie.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dist.css));
});


/* простой конкат  */
gulp.task('build-css-components', function () {
    return gulp.src("./spa/styl/components.styl")
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: (_ENV_ === 'production' || _ENV_ === 'beta') ? true : false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dist.css));
});


// return gulp.src([conf.src + '/pages/**/*.styl'])
//     .pipe(concat('pages.styl'))
//     .pipe(gulp.dest(conf.styl + '/temp'))
