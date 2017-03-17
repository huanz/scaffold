'use strict';
var path = require('path');
var inquirer = require('inquirer');
var argv = require('yargs');
var gulp = require('gulp');
var template = require('gulp-template');
var rename = require('gulp-rename');
var utils = require('../utils/utils');

function init(answers) {
    var templateDir = argv.argv.templates;
    var projectDir = utils.getProjectDir();
    var moduleName = '';
    var isHybridx = null;
    if (projectDir) {
        isHybridx = utils.isHybridx(projectDir);
        if (isHybridx !== -1) {
            moduleName = isHybridx ? 'JDBModule.getAppName()' : ("'" + utils.getPkgName(projectDir) + "'");
            gulp.src(path.join(templateDir, 'providers', answers.type + '.js'))
                .pipe(template({
                    modulename: moduleName,
                    name: answers.name,
                    uppername: utils.upperFirst(answers.name),
                    prefix: 'jdbApp' + utils.upperFirst(utils.getPkgName(projectDir)),
                    author: utils.getUser(),
                    date: utils.now()
                }))
                .pipe(rename(answers.name + '.js'))
                .pipe(gulp.dest(path.join(projectDir, 'app', 'scripts', answers.type + 's')))
                .on('finish', function () {
                    console.log('创建成功');
                });
            utils.insertRequire(projectDir, answers.type, answers.name);
        }
    } else {
        console.log('请在项目根目录执行该命令');
    }
}

module.exports = function () {
    var prompts = [{
        type: 'list',
        name: 'type',
        message: '请选择文件类型',
        default: 'controller',
        choices: ['controller', 'directive', 'filter', 'service', 'constant', 'factory']
    }, {
        type: 'input',
        name: 'name',
        message: '请输入文件名称（即类名）',
        validate: utils.validate
    }];
    inquirer.prompt(prompts).then(init);
};