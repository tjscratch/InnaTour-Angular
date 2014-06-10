module.exports = function (grunt) {

	'use strict';

	var path = require('path');
	var fs = require('fs');
	var sys = require('sys');


	grunt.loadNpmTasks('grunt-shell');

	grunt.initConfig({
		shell: {
			gulp: {
				options: {
					stdout: true,
					stderr: true
				},
				command: ["gulp build-project"].join('&&')
			}
		}
	});
};
