var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    conf = require('./config'),
    jeditor = require("gulp-json-editor");

var _ENV_ = process.env.NODE_ENV || '';




/* записываем в конфиг версию папки build */
var v = parseInt(conf.versionCode);
var renameBuild = {
    basename: 'version-',
    prefix: "build-",
    suffix: function(){
        if(v < 10) {
            return (v+1)
        } else if(v == 10) {
            return 0
        }
    }
};


gulp.task('version-cache', function () {
    return gulp.src(conf.config_path)
        .pipe(jeditor({
            'version' : renameBuild.prefix + renameBuild.basename + renameBuild.suffix(),
            'versionCode': renameBuild.suffix()
        }))
        .pipe(gulp.dest("./node_tasks"));
});