var gulp = require('gulp');
var gulpif = require('gulp-if');
var conf = require('./config');
var fs = require('fs');
var Q = require('q');

var _ENV_ = process.env.NODE_ENV || '';

var renameBuild = {
    basename: Math.random(1000).toString(16),
    prefix: "build-",
    suffix: "-" + Math.random(1000).toString(32)
};

global.cacheNameBuild = renameBuild.prefix + renameBuild.basename +   renameBuild.suffix;

gulp.task('rename-build', ['copy-project'], function (cb) {
    var deferred = Q.defer();

    fs.rename(conf.publish + '/build', conf.publish + '/'+ cacheNameBuild, function (err) {
        if (err) throw err;
        fs.stat(conf.publish + '/' + cacheNameBuild, function (err, stats) {
            if (err) throw err;
            deferred.resolve();
        });
    });
    return deferred.promise;
});
