'use strict';
var argv = require('yargs');

(function fixArgs() {
    if (argv.argv._[0] === 'hybridx') {
        argv.default('env', 'test')
            .default('platform', 'ios')
            .default('hybridx', true);
    }
})(argv);

var fs = require('fs');
var gulp = require('gulp');
var gulpTasks = require('@JDB/build');
var browserSync = require('browser-sync');
require('shelljs/global');

var moduleName = require('./package.json').name;
var LOCAL_MAP_FILE_PATH = './temp/getCodeFile.json';
var LOCAL_SERVER_URL = '';


var PLATFORM = argv.argv.platform;

function genZip() {
    var jsonData = require(LOCAL_MAP_FILE_PATH);
    var md5Str = '';
    exec('cd dist;zip -r ../temp/' + moduleName + '.zip ' + './' + moduleName);
    jsonData.data.hybridFileList = jsonData.data.hybridFileList.map(function (hybridFile) {
        if (hybridFile.filePath === moduleName) {
            hybridFile.fileMd5 = exec('md5 -q ' + './temp' + '/' + moduleName + '.zip').stdout.trim();
            md5Str = hybridFile.fileMd5;
            hybridFile.fileURL = LOCAL_SERVER_URL + '/' + moduleName + '.zip';
        }
        return hybridFile;
    })
    jsonData.data.hybridUpdateMd5 = md5Str;
    fs.writeFile(LOCAL_MAP_FILE_PATH, JSON.stringify(jsonData), (err) => {
        if (err) throw err;
    });
}

function androidPush() {
    exec('adb push ./dist/' + moduleName + ' /sdcard/.rrx/.hy/www');
}

function hybridxPush() {
    PLATFORM === 'ios' ? genZip() : androidPush();
}

gulp.task('hybridx:watch', function () {
    gulp.watch('./app/styles/**/*.{css,scss}', function () {
        gulp.start('styles', hybridxPush);
    });
    gulp.watch('./app/images/**/*.', function () {
        gulp.start('images', hybridxPush);
    });
    gulp.watch('./app/views/**/*.html', function () {
        gulp.start('markup', hybridxPush);
    });
    gulp.watch('./app/scripts/**/*.js', function () {
        gulp.start('browserify', hybridxPush);
    });
});

gulp.task('hybridx:compile', function () {
    gulp.start(['styles', 'images', 'markup', 'browserify'], hybridxPush);
});

gulp.task('hybridx:server', function () {
    browserSync({
        open: false,
        server: [
            './temp'
        ],
        notify: false,
        logLevel: 'info',
        logPrefix: 'LOCAL SERVE'
    }, function (err, bs) {
        LOCAL_SERVER_URL = bs.options.getIn(['urls', 'external']);
    });
});

gulp.task('hybridx', ['prepare'], function () {
    var tasks = ['hybridx:compile', 'hybridx:watch'];
    if (PLATFORM === 'ios') {
        tasks.push('hybridx:server');
    }
    gulp.start(tasks);
});