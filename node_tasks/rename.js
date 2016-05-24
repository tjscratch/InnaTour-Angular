var gulp = require('gulp');
var gulpif = require('gulp-if');
var conf = require('./config');
var fs = require('graceful-fs');
var Q = require('q');

var _ENV_ = process.env.NODE_ENV || '';

var renameBuild = {
    basename: Math.random(1000).toString(16),
    prefix: "build-",
    suffix: "-" + Math.random(1000).toString(32)
};

var cacheNameBuild = renameBuild.prefix + renameBuild.basename +   renameBuild.suffix;

gulp.task('rename-build', function (cb) {
    var deferred = Q.defer();

    fs.rename(conf.build, './'+ cacheNameBuild, function (err) {
        if (err) throw err;
        fs.stat(conf.build + '/' + cacheNameBuild, function (err, stats) {
            if (err) throw err;
            deferred.resolve();
        });
    });
    return deferred.promise;
});


exports.cacheNameBuild = cacheNameBuild;