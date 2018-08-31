const path = require('path');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const workboxBuild = require('workbox-build');

const config = require('../config');
const pkg = require(path.join(process.cwd(), 'package.json'));
const argv = require('../utils/argv');

const serviceFileName = `service-${argv.unregister ? 'un' : ''}register.js`;

gulp.task('sw-inject', () => {
    return gulp.src(`${config.html.dist}/*.html`)
        .pipe(replace('</body>', `<script>!function(){var e=document.createElement("script"),t=document.getElementsByTagName("script")[0];e.async=!0,e.src="./${serviceFileName}?v="+Date.now(),t.parentNode.insertBefore(e,t)}();</script></body>`))
        .pipe(gulp.dest(config.html.dist));
});

gulp.task('sw-generate', () => {
    return workboxBuild.generateSW({
        importWorkboxFrom: 'local',
        globDirectory: config.dist,
        globPatterns: ['**/*.{html,js,css,png,jpg,jpeg,gif,webp,ttf,woff,woff2,eot,svg}'],
        skipWaiting: true,
        clientsClaim: true,
        swDest: `${config.html.dist}/service-worker.js`,
        cacheId: pkg.name,
        globIgnores: [serviceFileName, '**/*.map']
    });
});

gulp.task('sw-version', () => {
    return gulp.src(path.join(__dirname, '..', 'sw', serviceFileName))
        .pipe(uglify(config.uglify))
        .pipe(replace('{{version}}', Date.now()))
        .pipe(gulp.dest(config.html.dist));
});

gulp.task('sw', ['sw-inject', 'sw-generate', 'sw-version']);
