const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const browserSync = require('browser-sync');

const config = require('../config').browserSync;

gulp.task('browserSync', () => {
    try {
        if (fs.statSync(path.join(process.cwd(), 'assets', 'data')).isDirectory()) {
            config.server.push('assets/data');
        }
    } catch (error) {

    }
    browserSync(config);
});