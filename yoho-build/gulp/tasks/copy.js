const gulp = require('gulp');

const config = require('../config');

gulp.task('copy', () => {
    return gulp.src(config.font.src)
        .pipe(gulp.dest(config.font.dist));
});