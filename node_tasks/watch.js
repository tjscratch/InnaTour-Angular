var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    livereload = require('gulp-livereload'),
    conf = require('./config');

var _ENV_ = process.env.NODE_ENV;


gulp.task('watch', function () {
    var server = livereload();


    gulp.watch([
            conf.styl + '/**/*.styl',
            '!'+ conf.styl +'/**/ticket.styl',
            '!'+ conf.styl +'/**/ie.styl',
            '!'+ conf.styl +'/**/print.styl'
    ], ['styl-common'])
        .on('change', function(file) {
            server.changed(file.path);
        });

    gulp.watch(conf.angular + '/components/**/*.styl', ['styl-components'])
        .on('change', function(file) {
            server.changed(file.path);
        });

    gulp.watch(conf.angular + '/pages/**/*.styl', ['styl-pages'])
        .on('change', function(file) {
            server.changed(file.path);
        });

    gulp.watch(conf.angular + '/regions/**/*.styl', ['styl-regions'])
        .on('change', function(file) {
            server.changed(file.path);
        });
		
	gulp.watch(conf.styl + '/partners/**/*.styl', ['styl-partners'])
	.on('change', function(file) {
		server.changed(file.path);
	});

    gulp.watch(conf.dest+'/less/**/*', ['less']);

    // components page regions
    gulp.watch([
            conf.angular+'/components/**/*.js',
            conf.angular+'/pages/**/*.js',
            conf.angular+'/regions/**/*.js'
    ], ['concat-comp-page-regions']);

    gulp.watch([
            conf.templ+'/**/*.html',
            conf.dest+'/js/angular/**/*.html'
    ], ['build-templates']);
});

gulp.task('watch-angular-parts', function () {
    var server = livereload();

    gulp.watch(conf.angular + '/controllers/**/*.js', ['build-controllers'])
        .on('change', function(file) {
            server.changed(file.path);
        });
	gulp.watch(conf.angular + '/services/**/*.js', ['build-services'])
        .on('change', function(file) {
            server.changed(file.path);
        });
	gulp.watch(conf.angular + '/directives/**/*.js', ['build-directives'])
        .on('change', function(file) {
            server.changed(file.path);
        });
	gulp.watch(conf.angular + '/models/**/*.js', ['build-models'])
        .on('change', function(file) {
            server.changed(file.path);
        });		
	gulp.watch(conf.angular + '/helpers/**/*.js', ['build-helpers'])
        .on('change', function(file) {
            server.changed(file.path);
        });
	gulp.watch(conf.angular + '/ang.helpers/**/*.js', ['build-ang.helpers'])
        .on('change', function(file) {
            server.changed(file.path);
        });		
});