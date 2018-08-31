const path = require('path');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const gulpif = require('gulp-if');
const postcss = require('gulp-postcss');
const scss = require('postcss-scss');
const stylelint = require('stylelint');
const reporter = require('postcss-reporter');
const cache = require('gulp-cached');
const config = require('../config');
const argv = require('../utils/argv');

const LintScript = Array.isArray(config.script.src) ? ['!**/*min.js'].concat(config.script.src) : [config.script.src, '!**/*min.js'];
const LintStyle = Array.isArray(config.style.src) ? ['!**/*min.{scss,sass,css}'].concat(config.style.src) : [config.style.src, '!**/*min.{scss,sass,css}'];

function isFixed(file) {
    return file.eslint != null && file.eslint.fixed;
}

gulp.task('lint:script', () => {
    return gulp.src(LintScript)
        .pipe(cache('lint:script'))
        .pipe(eslint({
            fix: argv.debug,
            configFile: path.join(__dirname, '..', '.eslintrc.js')
        }))
        .pipe(eslint.format())
        .pipe(gulpif(isFixed, gulp.dest(`${config.src}/scripts`)))
        .pipe(gulpif(!argv.debug, eslint.failAfterError()));
});

gulp.task('lint:style', () => {
    return gulp.src(LintStyle)
        .pipe(cache('lint:style'))
        .pipe(postcss([
            stylelint({
                fix: argv.debug,
                configFile: path.join(__dirname, '..', '.stylelintrc.js')
            }),
            reporter({clearReportedMessages: true, throwError: !argv.debug})
        ], {syntax: scss}))
        .on('error', () => {
            console.log('\u001b[31mStylelint warnings or errors were found, please fix them\u001b[39m\n');
            process.exit(1);
        })
        .pipe(gulp.dest(`${config.src}/styles`));
});


gulp.task('lint', ['lint:style', 'lint:script']);