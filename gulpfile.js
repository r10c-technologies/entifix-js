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

//gulp.task('dist', ['clean-dist'], ()=>
gulp.task('dist', ()=>
{
    // Transfer files
    var cssFiles = gulp.src('src/css/**/*.*').pipe(gulp.dest('dist/'));
    
    var concatEntifix = gulp.src(['src/entifix-js.js', 'src/entifix-security-management.js', 'src/js/**/*.js', 'src/shared/**/*.js'])
                            .pipe(replace('src/','dist/'))
                            .pipe(babel({presets: ['babel-preset-es2015'].map(require.resolve)}))
                            .pipe(concat('entifix-js.js'))
                            .pipe(gulp.dest('dist'));

    var imgFiles = gulp.src('src/img/*.*').pipe(gulp.dest('dist/img'));

    // Minify module
    var minifyEntifix = gulp.src(['src/entifix-js.js', 'src/entifix-security-management.js', 'src/js/**/*.js', 'src/shared/**/*.js'])
                            .pipe(replace('src/','dist/'))
                            .pipe(babel({presets: ['babel-preset-es2015'].map(require.resolve)}))
                            .pipe(concat('entifix-js.min.js'))
                            .pipe(uglify().on('error', function(e){
                                console.log('Error al minificar/ofuscar entifix: ' + e);
                            }))
                            .pipe(gulp.dest('dist'));
    
    return merge(imgFiles, cssFiles, concatEntifix, minifyEntifix);
});


//====================================================================================================================
//====================================================================================================================
