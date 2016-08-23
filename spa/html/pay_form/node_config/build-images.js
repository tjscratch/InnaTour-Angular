var gulp     = require('gulp'),
    size     = require('gulp-size'),
    imagemin = require('gulp-imagemin'),
    conf     = require('./config');


gulp.task('build-img', function () {
    return gulp.src(conf.images)
        .pipe(size({title: 'размер изображений до оптимизации----------------'}))
        .pipe(imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(conf.build.images))
        .pipe(size({title: 'размер изображений после оптимизации-------------'}));
});
