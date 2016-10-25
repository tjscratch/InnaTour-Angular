var gulp = require('gulp'),
    del  = require('del'),
    conf = require('./config');


gulp.task('clear-build', del.bind(null, [conf.build.build_path]));