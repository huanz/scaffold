const path = require('path');
const gulp = require('gulp');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
const size = require('gulp-size');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const config = require('../config');
const argv = require('../utils/argv');

const postcssPlugins = [autoprefixer(config.autoprefixer), cssnano({
    discardComments: {
        removeAll: true
    }
})];

const minijs = (file) => {
    return !argv.debug && path.extname(file.path) === '.js' && !file.path.endsWith('.min.js');
};

const minicss = (file) => {
    return !argv.debug && path.extname(file.path) === '.css' && !file.path.endsWith('.min.css');
};

const minihtml = (file) => {
    return !argv.debug && path.extname(file.path) === '.html';
};


gulp.task('html', () => {
    return gulp.src(config.html.src)
        .pipe(useref())
        .pipe(gulpif(minijs, uglify(config.uglify)))
        .pipe(gulpif(minicss, postcss(postcssPlugins)))
        .pipe(gulpif(minihtml, htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        })))
        .pipe(gulpif('*.html', size({
            title: 'html',
            showFiles: true
        })))
        .pipe(gulp.dest(config.html.dist));
});