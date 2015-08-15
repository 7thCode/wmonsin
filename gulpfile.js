var gulp = require('gulp');

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
            'public/javascripts/*.min.js',
            'public/stylesheets/*.css',
            'public/backend/javascripts/*.min.js',
            'public/backend/stylesheets/*.css',
            'public/front/javascripts/*.min.js',
            'public/front/stylesheets/*.css'
        ],
        {base: '..'}
    )
        .pipe(gulp.dest('dest'));
});