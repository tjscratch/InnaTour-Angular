var gulp = require('gulp');
var del = require('del');
var config = require('./config');

gulp.task('remove-dist', function (cb) {
    return del(config.dist.src, {
        force: true
    }, cb);
});
