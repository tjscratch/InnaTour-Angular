var gulp = require('gulp');
var svgSprite = require("gulp-svg-sprite");

gulp.task('svg-sprite', function () {
    return gulp.src('spa/img/svg-icons/*.svg')
        .pipe(svgSprite({
            mode: {
                dest:'.',
                css:{
                    bust : false,
                    dest:'dist/spa/css',
                    sprite:'../img/svg-icons/sprite.svg',
                    render:{
                        styl:{
                            dest : '../../../spa/styl/sprite-svg.styl'
                        }
                    }
                }
            },
            svg: {
                xmlDeclaration: false,
                doctypeDeclaration: false
            }
        }))
        .pipe(gulp.dest('.'));
});
