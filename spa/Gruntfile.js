module.exports = function (grunt) {

	'use strict';

	grunt.initConfig({

		// configurable paths
		yeoman: {
            app: '',
            images: '<%=yeoman.app %>/img',
            imagesWebPath: '<%=yeoman.app %>/img'
		}
	});

	grunt.loadTasks(__dirname + '/node_tasks');
};
