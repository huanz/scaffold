const gulp = require('gulp');
const runSequence = require('run-sequence');

runSequence.options.showErrorStackTrace = false;

gulp.task('build', ['clean'], (cb) => {
    runSequence(
        'lint',
        ['style', 'html', 'browserify', 'image'],
        'rev',
        'sw',
        cb
    );
});

gulp.task('default', ['clean'], (cb) => {
    runSequence(
        'lint',
        ['style', 'html', 'browserify', 'image'],
        'browserSync',
        'watch',
        cb
    );
});