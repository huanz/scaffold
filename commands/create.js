'use strict';
var path = require('path');
var inquirer = require('inquirer');
var argv = require('yargs');
var gulp = require('gulp');
var template = require('gulp-template');
var utils = require('../utils/utils');

function init(answers) {
    var templateDir = argv.argv.templates;
    var projectDir = utils.getProjectDir();
    if (projectDir) {
        //gulp.src(path.join(templateDir, 'app', ''))
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
        message: '请输入文件名称',
        validate: utils.validate
    }];
    inquirer.prompt(prompts).then(init);
};