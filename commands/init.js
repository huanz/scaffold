'use strict';
var path = require('path');
var inquirer = require('inquirer');
var argv = require('yargs');
var gulp = require('gulp');
var template = require('gulp-template');
var gulpif = require('gulp-if');
var install = require('gulp-install');
var utils = require('../utils/utils');

function init(answers) {
    if (!answers.hybridx) {
        console.log('目前只支持hybridx项目');
        return false;
    }

    var projectDir = utils.getProjectDir(answers.name);
    var templatesDir = argv.argv.templates;
    var files = [templatesDir + '/common/**'];
    if (projectDir) {
        files.push(path.join(argv.argv.templates, answers.hybridx ? 'hybridx' : 'hybrid') + '/**');
        gulp.src(files)
            .pipe(template({
                prefix: 'jdbApp' + utils.upperFirst(answers.name),
                name: answers.name,
                modulename: answers.hybridx ? 'JDBModule.getAppName()' : ("'" + utils.getPkgName(projectDir) + "'"),
                author: utils.getUser(),
                date: utils.now()
            }))
            .pipe(gulpif(function (file) {
                return utils.startsWith(file.path, templatesDir + '/common');
            }, gulp.dest(projectDir), gulp.dest(path.join(projectDir, 'app'))))
            .on('finish', function () {
                console.log('项目初始化完成');
                console.log('开始自动安装依赖');
                gulp.src(path.join(projectDir, 'package.json'))
                    .pipe(install());
            });
    } else {
        console.log('创建项目目录失败');
    }
}

module.exports = function (argv) {
    var prompts = [{
        type: 'input',
        name: 'name',
        message: '请输入项目名：',
        default: argv.name || utils.getPkgName(),
        validate: utils.validate
    }, {
        type: 'confirm',
        name: 'hybridx',
        message: '是否为hybridx？',
        default: true
    }];
    inquirer.prompt(prompts).then(init);
};