var gulp = require('gulp');

var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('copy', function () {
    return gulp.src(
        [
            'bin/www',
            '*.js',
            'package.json',
            'config/config.json',
            'views/**/*.jade',
            'routes/**/*.js',
            'public/bower.json',
            'public/favicons/*',
            'public/**/*.css',
            'public/**/*.svg',
            'public/**/*.png',
            'public/stylesheets/*.css',
            'public/backend/stylesheets/*.css',
            'public/front/stylesheets/*.css',
            'public/font/*'
        ],
        {base: '..'}
    )
        .pipe(gulp.dest('dest'));
});

gulp.task('concat', function () {
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

gulp.task('default', ['copy'], function() {
    console.log('done');
});