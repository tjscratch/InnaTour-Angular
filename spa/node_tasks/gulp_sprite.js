var gutil = require('gulp-util');
var log = gutil.log;

var _ = require('underscore');
var path = require('path');
var sprite = require('node-sprite');
var fs = require('fs');

module.exports = function (options) {

	sprite.sprites({ path: path.resolve(options.src)}, function (err, result) {

		if (!err) {
			_.each(result, function (pack, e) {

				var spriteStr = "// This file was generated automaticly, so don't modify it!\n";
				spriteStr += "." + pack.name + " {\n";
				spriteStr += '\tbackground-image: url("' + options.src + pack.filename() + '");\n';
				spriteStr += '\tbackground-repeat: no-repeat;\n';
				spriteStr += '\tdisplay: inline-block;\n';
				spriteStr += "}\n";

				_.each(pack.images, function (file) {

					spriteStr += ".icon-sprite-" + file.name + "{";
					spriteStr += "\n";
					spriteStr += "\t@extend ." + pack.name + ";\n";
					spriteStr += "\twidth: " + file.width + "px;\n";
					spriteStr += "\theight: " + file.height + "px;\n";
					spriteStr += "\tbackground-position: " + (-file.positionX) + "px " + (-file.positionY) + "px;\n";
					//}
					spriteStr += "}\n";
				});

				fs.writeFile(path.resolve(options.dest), spriteStr, function (errFile) {
					if (errFile) {
						throw errFile;
					} else {
						console.log('File ' + options.dest + ' was updated+');
						options.done();
					}
				});
			});


		} else {
			log(gutil.colors.red(err));
			options.done();
		}
	});
}
