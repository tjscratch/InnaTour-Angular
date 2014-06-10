var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var conf = require('./config');

var _ENV_ = process.env.NODE_ENV || '';

// зависимость от сборки шаблонов
gulp.task('build-concat', ['build-templates'], function () {
    return gulp.src([
            conf.dest + '/js/angular/helpers/*.js',
            conf.dest + '/js/datepicker.js',
            conf.dest + '/js/angular/models/app.model.js',
            conf.dest + '/js/angular/models/*.js',
            conf.dest + '/js/angular/**/*.js',

            // собираем и шаблоны тоже
            conf.build + '/js/templates.js'
    ])

        .pipe(concat('app-main.js'))
        .pipe(gulpif(_ENV_ === 'production', uglify()))
        .pipe(gulp.dest(conf.build+'/js'));
});

