var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    conf        = require('./node_config/config'),
    tasks       = require('require-dir')('./node_config');


gulp.task('html', function () {
    return gulp.src('./spa/index.html')
        .pipe(gulp.dest(conf.build.build_path))
        .pipe($.size({title: 'html'}));
});

gulp.task('dev', function () {
        runSequence(
            'clear-build',
            'html',
            'build-img',
            'build-css',
            'build-js'
        );
        browserSync({
            notify: false,
            server: ['build']
        });

        gulp.watch(['spa/index.html'], ['html', reload]);
        gulp.watch(['spa/js/components/**/*.js', 'spa/js/services/*.js', 'spa/js/*.js', 'spa/js/components/**/*.html'], ['build-js', reload]);
        gulp.watch([conf.css, 'spa/css/vars.styl'], ['build-css', reload]);
        gulp.watch([conf.images], ['build-img', reload]);
    }
);