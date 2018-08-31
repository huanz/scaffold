const path = require('path');
const defaultsDeep = require('lodash.defaultsdeep');

const argv = require('./utils/argv');

const SRC = 'src';
const DIST = 'dist';

let config = {
    src: SRC,
    dist: DIST,
    style: {
        src: `${SRC}/styles/**/*.{css,sass,scss}`,
        dist: `${DIST}/styles`
    },
    image: {
        src: `${SRC}/images/**`,
        dist: `${DIST}/images`
    },
    font: {
        src: `${SRC}/fonts/*.{ttf,woff,woff2,eot,svg}`,
        dist: `${DIST}/fonts`
    },
    html: {
        src: `${SRC}/**/*.html`,
        dist: DIST
    },
    script: {
        src: `${SRC}/scripts/**/*.js`,
        dist: `${DIST}/scripts`
    },
    browserSync: {
        notify: false,
        logPrefix: 'YOHO',
        open: 'external',
        server: [DIST],
        middleware: [(req, res, next) => {
            req.method = 'GET';
            next();
        }]
    },
    browserify: {
        entries: [`${SRC}/scripts/app.js`],
        debug: argv.debug,
        transform: ['browserify-shim', 'browserify-html']
    },
    autoprefixer: {
        browsers: [
            'ie >= 10',
            'ie_mob >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 7',
            'opera >= 23',
            'ios >= 7',
            'android >= 4.4',
            'bb >= 10'
        ]
    },
    uglify: {
        compress: {
            drop_console: true
        }
    }
};
/**
 * @desc 继承.yohorc.js
 */
try {
    let yohoConfig = require(path.join(process.cwd(), '.yohorc.js'));
    config = defaultsDeep(typeof yohoConfig === 'function' ? yohoConfig(argv) : yohoConfig, config);
} catch (error) {

}

module.exports = config;