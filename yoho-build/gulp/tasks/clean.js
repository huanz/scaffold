const gulp = require('gulp');
const del = require('del');

gulp.task('clean', () => {
    return del(['dist/*', '!dist/.git'], {
        dot: true
    });
});