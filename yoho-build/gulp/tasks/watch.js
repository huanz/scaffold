const gulp = require('gulp');
const browserSync = require('browser-sync');

const reload = browserSync.reload;
const config = require('../config');

gulp.task('watch', () => {
    gulp.watch(config.html.src, ['html', reload]);
    gulp.watch(config.style.src, ['lint:style', 'style', reload]);
    gulp.watch(config.script.src, ['lint:script', 'browserify']);
    gulp.watch(config.image.src, ['image', reload]);
});