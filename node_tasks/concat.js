var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var gulpif = require('gulp-if');
var conf = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

// зависимость от сборки шаблонов
gulp.task('build-concat', ['build-templates'], function () {
    return gulp.src([
            conf.dest + '/lib/polyfill.js',
            conf.dest + '/lib/jquery-ui-1.10.4.custom/js/jquery-ui-1.10.4.custom.min.js',
            conf.dest + '/js/jquery.ui.datepicker-ru.js',

            conf.dest + '/js/google.maps.clustering.js',

            conf.dest + '/js/angular/plugins/*.js',
            conf.dest + '/js/datepicker.js',

            conf.dest + '/js/angular/helpers/*.js',
            conf.dest + '/js/angular/models/app.model.js',
            conf.dest + '/js/angular/models/*.js',
            conf.dest + '/lib/angular-cookies.min.js',
            conf.dest + '/lib/angular-locale_ru-ru.js',
            conf.dest + '/js/angular/app.js',

            // собираем и шаблоны тоже
            conf.build + '/js/templates.js',

            conf.dest + '/js/angular/**/*.js'
    ])

        .pipe(concat('app-main.js'))
        .pipe(gulpif(_ENV_ === 'production', uglify({
            mangle: false,
            outSourceMap: true
        })))
        .pipe(gulp.dest(conf.build +'/js'));
});

