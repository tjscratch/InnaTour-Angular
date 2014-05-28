var gulpmatch = require('gulp-match');

module.exports = function(obj) {
	var imagePath = 'app/images/' + obj.string;
	//console.log(imagePath);

	var isFile = gulpmatch(imagePath, true);
	var avoidСache = '';

	if (isFile) {
		avoidСache = Math.random().toString(16);
	} else {
		console.warn(' NOT FOUND: ' + obj.string);
	}

	return avoidСache;
};
