var conf = require('./config');
var del = require('del');

var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');
var handlebars = require('handlebars');
var tmpl = require('./styl.template.handlebars');


var spritesmith = require('gulp.spritesmith');


gulp.task('remove-sprite-style', function (cb) {
  return del(conf.sprites + '/build', {
    force: true
  }, cb);
});

gulp.task('remove-sprite-img', function (cb) {
  return del(conf.styl + '/sprite.styl', {
    force: true
  }, cb);
});


gulp.task('sprite-gen', ['remove-sprite-style', 'remove-sprite-img'], function () {

  var spriteData = gulp.src(conf.sprites + '/**/*.png').pipe(spritesmith({
    imgName: 'sprite-' + Math.random(1000).toString(16) + '.png',
    cssName: 'sprite.styl',
    cssTemplate: tmpl
  }));

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest(conf.sprites + '/build'));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
    //.pipe(csso())
    .pipe(gulp.dest(conf.styl));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
  //return spriteData.pipe(gulp.dest(conf.sprites));
});
