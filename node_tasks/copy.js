var gulp = require('gulp');
var _ENV_ = process.env.NODE_ENV;

gulp.task('test-copy-files', function () {
    gulp.src([
        './index.html',
        './web.config',
        './closer.html'
    ])
        .pipe(gulp.dest('publish'));

    gulp.src(['./tours/**/*'])
        .pipe(gulp.dest('publish/tours'));

    return gulp.src([
        './spa/**/*',

        '!./spa/node_modules/**/*',
        '!./spa/gulpfile.js',
        '!./spa/package.json',
        '!./spa/*.sublime-project',
        '!./spa/*.sublime-workspace'
    ])
        .pipe(gulp.dest('publish/spa'));
});

return gulp.task('test-copy-test', function () {
    console.log('sdlfkhjfgh');
});
