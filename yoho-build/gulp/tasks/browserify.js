const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const browserSync = require('browser-sync');
const gulpif = require('gulp-if');
const size = require('gulp-size');
const bro = require('gulp-bro');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const commentJson = require('comment-json');

const config = require('../config');
const argv = require('../utils/argv');
const handleErrors = require('../utils/handleErrors');

const browserifyConfig = Object.assign({}, config.browserify);
/**
 * @desc tinyify压缩
 */
if (!argv.debug) {
    if (browserifyConfig.plugin && Array.isArray(browserifyConfig.plugin)) {
        if (!browserifyConfig.plugin.includes('tinyify')) {
            browserifyConfig.plugin.push('tinyify');
        }
    } else {
        browserifyConfig.plugin = ['tinyify'];
    }
}
gulp.task('browserify', () => {
    /**
     * @desc 获取mockApi
     */
    let apiConfig = {};
    try {
        let apiConfigStr = fs.readFileSync(path.join(process.cwd(), 'assets', 'api.json')).toString();
        apiConfig = commentJson.parse(apiConfigStr, null, true);
    } catch (error) {}
    return gulp.src(browserifyConfig.entries)
        .pipe(bro(browserifyConfig))
        .on('error', handleErrors)
        .pipe(replace(/{{(\w+Api)}}/g, (match, apiName) => {
            let apiType = argv.env || 'serve';
            return apiConfig[apiName][apiType] || '';
        }))
        .pipe(gulpif(argv.debug, sourcemaps.init({
            loadMaps: true
        })))
        .pipe(gulpif(argv.debug, sourcemaps.write('./')))
        .pipe(size({
            title: 'scripts'
        }))
        .pipe(gulp.dest(config.script.dist))
        .pipe(browserSync.reload({
            stream: true
        }));
});