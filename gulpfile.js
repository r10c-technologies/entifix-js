var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var babel  = require('gulp-babel');
var merge = require('merge-stream');
var replace = require('gulp-string-replace');
var del = require('del');
var rename = require('gulp-rename');

//PACKAGE APLICATION _________________________________________________________________________________________________
//====================================================================================================================

//PACKAGE ENTIFIX-JS
gulp.task('clean-dist', () => {
    return del(['dist/**/*']);
});

gulp.task('dist', ['clean-dist'], ()=>
{
    // Transfer files
    var cssFiles = gulp.src('src/css/**/*.*').pipe(gulp.dest('dist/css'));
    var fontFiles = gulp.src('src/fonts/*.*').pipe(gulp.dest('dist/fonts'));
    var imgFiles = gulp.src('src/img/*.*').pipe(gulp.dest('dist/img'));
    
    var htmlFiles = gulp.src('src/**/*.html')
                            .pipe(replace('src/img/security.png', 'dist/img/security.png'))
                            .pipe(gulp.dest('dist'));

    // Minify module
    var minifyEntifix = gulp.src(['src/entifix.js', 'src/js/**/*.js', 'src/shared/**/*.js'])
                            .pipe(replace('src/','dist/'))
                            .pipe(babel({presets: ['babel-preset-es2015'].map(require.resolve)}))
                            .pipe(concat('entifix.min.js'))
                            .pipe(uglify().on('error', function(e){
                                console.log('Error al minificar/ofuscar entifix: ' + e);
                            }))
                            .pipe(gulp.dest('dist/js'))
    
    return merge(cssFiles, fontFiles, imgFiles, htmlFiles, minifyEntifix);
});

//====================================================================================================================
//====================================================================================================================