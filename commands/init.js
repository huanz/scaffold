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
    var projectDir = utils.getProjectDir(answers.name);
    var templatesDir = argv.argv.templates;
    var files = [templatesDir + '/common/**'];
    if (projectDir) {
        files.push(path.join(argv.argv.templates, answers.hybridx ? 'hybridx' : 'hybrid') + '/**');
        gulp.src(files)
            .pipe(template({
                name: answers.name,
                uppername: utils.upperFirst(answers.name),
                classname: 'Main'
            }))
            .pipe(gulpif(function (file) {
                return utils.startsWith(file.path, templatesDir + '/common');
            }, gulp.dest(projectDir), gulp.dest(path.join(projectDir, 'app'))))
            .pipe(install());
    } else {
        console.log('创建项目目录失败');
    }
}

module.exports = function (argv) {
    var prompts = [{
        type: 'input',
        name: 'name',
        message: '请输入项目名：',
        default: argv.name,
        validate: utils.validate
    }, {
        type: 'confirm',
        name: 'hybridx',
        message: '是否为hybridx？',
        default: true
    }];
    inquirer.prompt(prompts).then(init);
};