const gulp = require('gulp');
const RevAll = require('@jdb/gulp-rev-all');

const config = require('../config');

gulp.task('rev', () => {
    return gulp.src(`${config.dist}/**`)
        .pipe(RevAll.revision({
            dontRenameFile: ['.html']
        }))
        .pipe(gulp.dest(config.dist));
});