var gulp = require('gulp');

var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rimraf = require('rimraf');
var less = require('gulp-less');
var minifycss = require('gulp-minify-css');

gulp.task('copy', ['clean'], function () {
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
            'public/bower.json',
            'public/favicons/*',
            'public/**/*.css',
            'public/**/*.svg',
            'public/**/*.png',
            'public/font/*',
            'public/javascripts/*.js',
            'public/backend/javascripts/*.js',
            'public/front/javascripts/*.js'
        ],
        {base: '..'}
    )
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
    return gulp.src('public/**/stylesheets/*.less')
        .pipe(less())
        .pipe(minifycss())
        .pipe(gulp.dest('dist/wmonsin/public'));
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
        .pipe(gulp.dest('dist'));
});

gulp.task('jsconcat', function () {
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
        .pipe(gulp.dest('dist/wmonsin/public/javascripts'))
        .pipe(gulp.dest('public/javascripts'));
});

gulp.task('clean', function (cb) {
    rimraf('dist', cb);
});

gulp.task('ftp', function () {

    var conn = ftp.create({
        host: 'server',
        user: 'name',
        password: 'password',
        port:22,
        parallel: 1,
        log: gutil.log
    });

    return gulp.src(['dist/**'], {base: 'app/wmonsin', buffer: false})
        .pipe(conn.newer('/'))
        .pipe(conn.dest('/'));

});

gulp.task('default', ['copy', 'css', 'js'], function () {
    console.log('done');
});