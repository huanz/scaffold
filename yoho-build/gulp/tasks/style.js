const gulp = require('gulp');
const sass = require('gulp-sass');
const size = require('gulp-size');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const cssimport = require('postcss-import');

const config = require('../config').style;
const argv = require('../utils/argv');

let postcssPlugins = [cssimport(), autoprefixer(config.autoprefixer)];
if (!argv.debug) {
    postcssPlugins.push(cssnano({
        discardComments: {
            removeAll: true
        }
    }));
}

gulp.task('style', () => {
    return gulp.src(config.src)
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))
        .pipe(postcss(postcssPlugins))
        .pipe(size({
            title: 'styles'
        }))
        .pipe(gulp.dest(config.dist));
});