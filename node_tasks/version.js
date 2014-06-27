var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    conf = require('./config'),
    jeditor = require("gulp-json-editor");

var _ENV_ = process.env.NODE_ENV || '';




/* записываем в конфиг версию папки build */
var renameBuild = {
    basename: Math.random(1000).toString(16),
    prefix: "build-",
    suffix: "-" + Math.random(1000).toString(32)
};

var cacheNameBuild = renameBuild.prefix + renameBuild.basename + renameBuild.suffix;

gulp.task('version-cache', function () {
    return gulp.src(conf.config_path)
        .pipe(jeditor({
            'version': cacheNameBuild
        }))
        .pipe(gulp.dest("./node_tasks"));
});