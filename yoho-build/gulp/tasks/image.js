const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const size = require('gulp-size');
const gulpif = require('gulp-if');

const config = require('../config').image;
const argv = require('../utils/argv');

gulp.task('image', () => {
    return gulp.src(config.src)
        .pipe(gulpif(!argv.debug, imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(size({
            title: 'images'
        }))
        .pipe(gulp.dest(config.dist));
});