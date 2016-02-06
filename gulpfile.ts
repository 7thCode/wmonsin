'use strict';

declare function require(x:string):any;

var gulp = require('gulp');

var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var rimraf = require('rimraf');
var less = require('gulp-less');
var minifycss = require('gulp-minify-css');

gulp.task('copy', [], () => {
    return gulp.src(
        [
            'bin/www',
            'app.js',
            'package.json',
            'config/config.json',
            'config/logs.json',
            'model/*.js',
            'views/**/*.jade',
            'routes/**/*.js',
            'logs/*',
            'bower.json',
            '.bowerrc',
            'memo.md',
            'public/favicons/*',
            'public/**/*.css',
            'public/**/*.svg',
            'public/**/*.png',
            'public/font/**/*',
            'public/javascripts/*.js',
            'public/backend/javascripts/*.js',
            'public/front/javascripts/*.js',
            'public/output/output.pdf'
        ],
        {base: '..'}
    )
        .pipe(gulp.dest('../womnsin_image'));
});

gulp.task('css', () => {
    return gulp.src('public/**/stylesheets/*.less')
        .pipe(less())
        .pipe(minifycss())
        .pipe(gulp.dest('production/wmonsin/public'));
});

gulp.task('js', () => {
    return gulp.src(
        [
            'public/javascripts/*.js',
            'public/backend/javascripts/*.js',
            'public/front/javascripts/*.js'
        ],
        {base: '..'})
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('production'));
});

gulp.task('clean', (cb) => {
    rimraf('production', cb);
});

gulp.task('jsconcat', () => {
    return gulp.src(
        [
            'public/javascripts/*.js',
            'public/backend/javascripts/*.js',
            'public/front/javascripts/*.js'
        ],
        {base: '..'})
        .pipe(uglify())
        .pipe(concat('client.min.js'))
        .pipe(gulp.dest('production/wmonsin/public/javascripts'))
        .pipe(gulp.dest('public/javascripts'));
});

gulp.task('ftp', () => {

    var conn = ftp.create({
        host: '128.199.196.240',
        user: '',
        pass: '',
        parallel: 1,
        log: gutil.log
    });

    return gulp.src(['production/**'], {base: 'app/wmonsin', buffer: false})
        .pipe(conn.newer('/'))
        .pipe(conn.dest('/'));
});

gulp.task('default', ['copy', 'css', 'js'], () => {
    console.log('done');
});