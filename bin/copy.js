var gulp = require('gulp');
var config = require('./config');

gulp.task('copy-node-app', function () {
    gulp.src(config.nodeApp.path + '/**').pipe(gulp.dest(config.dist.nodeApp.path));
});
