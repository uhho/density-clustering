
(function () {
    'use strict';

    var
        // dependencies
        gulp = require('gulp'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        resolveDependencies = require('gulp-resolve-dependencies'),

        // source
        sources = './lib/*.js'
    ;

    gulp.task('build', function () {
        return gulp.src(sources)
            .pipe(resolveDependencies())
            .pipe(concat('clustering.js'))
            .pipe(gulp.dest('./dist'))
        ;
    });

    gulp.task('build-min', ['build'], function () {
        return gulp.src('./dist/clustering.js')
            .pipe(uglify())
            .pipe(concat('clustering.min.js'))
            .pipe(gulp.dest('./dist'))
        ;
    });

    gulp.task('default', ['build-min']);
})();
