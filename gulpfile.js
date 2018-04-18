/**
 * Created by Administrator on 2016/6/30.
 */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync');


gulp.task('sass', function() {
    return gulp.src('./sass/*.scss')
        .pipe(watch('./sass/*.scss'))
        .pipe(sass())
        .pipe(gulp.dest('./css'))
        .pipe(minifycss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css/min'))
})

//压缩合并JS文件
gulp.task('js', function() {
    return gulp.src('./script/*.js')
        .pipe(watch('./script/*.js'))
        .pipe(uglify()) //压缩
    // .pipe(rename({
    //     suffix: '.min'
    // })) //rename压缩后的文件名
        .pipe(gulp.dest('./script/min'))
})

gulp.task('browser-sync', function() {
    var files = [
        './html/*.html',
        './css/*.css',
        './script/*.js',
        './*.html'
    ];

    browserSync.init(files, {
        server: {
            baseDir: './'
        }
    })
})



gulp.task('default', ['browser-sync', 'js', 'sass'], function() {
    // gulp.src('./views/**/*.js')
    //     .pipe(uglify())
    //     .pipe(concat('main.js'))
    //     .pipe(gulp.dest('./js'));
});