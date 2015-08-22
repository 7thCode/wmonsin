var gulp = require('gulp');

var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rimraf = require('rimraf');
var less = require('gulp-less');
var minifycss = require('gulp-minify-css');

gulp.task('copy',['clean'], function () {
    return gulp.src(
        [
            'bin/www',
            'app.js',
            'package.json',
            'config/config.json',
            'views/**/*.jade',
            'routes/**/*.js',
            'public/bower.json',
            'public/favicons/*',
            'public/**/*.css',
            'public/**/*.svg',
            'public/**/*.png',
            'public/font/*'
        ],
        {base: '..'}
    )
        .pipe(gulp.dest('dest'));
});

gulp.task('css', function () {
   return gulp.src('public/**/stylesheets/*.less')
       .pipe(less())
       .pipe(minifycss())
       .pipe(gulp.dest('dest/wmonsin/public'));
});

gulp.task('js', function () {
    return gulp.src(
        [
            'public/javascripts/*.js',
            'public/backend/javascripts/*.js',
            'public/front/javascripts/*.js'
        ],
        {base: '..'}
    )

        .pipe(uglify())
        .pipe(concat('client.min.js'))
        .pipe(gulp.dest('dest/wmonsin/public/javascripts'))
        .pipe(gulp.dest('public/javascripts'));
});

gulp.task('clean', function (cb) {
    rimraf('dest', cb);
});

gulp.task('default', ['copy','css','js'], function() {
    console.log('done');
});