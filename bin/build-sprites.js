var del = require('del');
var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');
var handlebars = require('handlebars');
var spritesmith = require('gulp.spritesmith');


var tmpl = require('./sprite.handlebars');
var spritesPath = './spa/img/sprites/**/*.png';
var distSpritesCss = './spa/styl';
var distSpritesImg = './spa/img/sprites/build';


gulp.task('build-sprite-remove-build', function (cb) {
    return del(distSpritesImg, {
        force: true
    }, cb);
});

gulp.task('build-sprite-remove-style', function (cb) {
    return del(distSpritesCss + '/sprite.styl', {
        force: true
    }, cb);
});


gulp.task('build-sprite', ['build-sprite-remove-build', 'build-sprite-remove-style'], function () {
    
    var spriteData = gulp.src(spritesPath).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.styl',
        cssTemplate: tmpl
    }));

    var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest(distSpritesImg));
    
    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
        .pipe(gulp.dest(distSpritesCss));
    
    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
});
