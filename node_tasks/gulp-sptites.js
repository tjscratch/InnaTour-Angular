var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var sprite = require('node-sprite');
var Q = require('q');
var _ = require('underscore');

var exec = require('child_process').exec;
var fs = require('fs');
var conf = require('./config');
var log = gutil.log;

var defArr = [];
var spriteStr = "// This file was generated automaticly, so don't modify it!\n";

function sprites(options) {
    sprite.sprites({path: path.resolve(options.src)}, function (err, result) {

        if (err) {
            log(gutil.colors.red(err));
        } else {


            _.each(result, function (pack) {
                var def = Q.defer();

                spriteStr += ".new-" + pack.name + "\n";
                spriteStr += '\tbackground-image: url("' + options.imgPathSparite + pack.filename() + '");\n';
                spriteStr += '\tbackground-repeat: no-repeat;\n';
                spriteStr += '\tdisplay: inline-block;\n';
                spriteStr += "\n";

                pack.images.forEach(function (file) {
                    spriteStr += ".icon-sprite-" + file.name;
                    spriteStr += "\n";
                    spriteStr += "\t@extend .new-" + pack.name + ";\n";
                    spriteStr += "\twidth: " + file.width + "px;\n";
                    spriteStr += "\theight: " + file.height + "px;\n";
                    spriteStr += "\tbackground-position: " + (-file.positionX) + "px " + (-file.positionY) + "px;\n";
                    spriteStr += "\n";
                });

                defArr.push(def.promise);
                def.resolve();
            });


            // пишем наш файл стилей и иконками
            Q.all(defArr).then(function () {
                fs.writeFile(path.resolve(options.dest), spriteStr, function () {
                    if (err) throw err;
                    console.log('File ' + options.dest + ' was updated');
                    options.done();
                });
            })

        }
    });
}


gulp.task('sprite', function (cb) {
    sprites({
        src: conf.img + '/sprites',
        imgPathSparite : '/spa/sprites/',
        dest: conf.styl + '/sprite.styl',
        done: cb
    });
});
