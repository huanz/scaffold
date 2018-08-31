/**
 * @file 初始化项目
 * @author bukas
 */
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const inquirer = require('inquirer');
const gulp = require('gulp');
const template = require('gulp-template');
const install = require('gulp-install');
const commandExists = require('command-exists');
const ora = require('ora');
const config = require('../config');
const utils = require('../common/utils');

exports.command = 'init';
exports.aliases = 'i';
exports.describe = '初始化项目';
exports.builder = {
    name: {
        alias: 'n',
        describe: '项目名',
        type: 'string'
    },
    type: {
        alias: 't',
        describe: '项目类型：端内/端外项目',
        choices: config.type.map(type => type.value)
    },
    template: {
        alias: 'tpl',
        describe: '项目模板',
        type: 'string'
    }
};
exports.handler = argv => {
    let prompts = [];
    if (!argv.name) {
        prompts.push({
            type: 'input',
            name: 'name',
            message: '请输入项目名：',
            validate: utils.validDir
        });
    }
    if (!argv.type) {
        prompts.push({
            type: 'list',
            name: 'type',
            message: '请选择项目类型',
            choices: config.type
        });
    }
    if (!argv.template) {
        prompts.push({
            type: 'list',
            name: 'template',
            message: '请选择项目模板',
            default: 'angular2',
            choices: answers => config.type.find(type => type.value === answers.type || type.value === argv.type).templates
        });
    }
    let params = Object.assign({}, argv);
    delete params._;
    delete params['$0'];

    if (prompts.length) {
        return inquirer.prompt(prompts).then(answers => checkDir(Object.assign(params, answers)).then(run));
    } else {
        return checkDir(params).then(run);
    }
};

function checkDir(params) {
    return new Promise((resolve, reject) => {
        try {
            let dir = path.join(config.cwd, params.name);
            if (fs.statSync(dir).isDirectory()) {
                inquirer
                    .prompt([
                        {
                            type: 'confirm',
                            name: 'empty',
                            default: true,
                            message: `${params.name}目录已存在，是否清空？`
                        }
                    ])
                    .then(answers => {
                        if (answers.empty) {
                            utils.emptyDir(dir);
                        }
                        resolve(params);
                    })
                    .catch(reject);
            } else {
                resolve(params);
            }
        } catch (error) {
            resolve(params);
        }
    });
}

function run(params) {
    const spinner = ora({
        text: '开始初始化项目工程\n',
        spinner: 'hearts'
    }).start();

    let projectDir = path.join(config.cwd, params.name);
    let templates = path.join(config.templateDir, params.type, params.template, '**');
    let pkgPath = path.join(projectDir, 'package.json');

    switch (params.template) {
    case 'angular2-mobile':
        // ngu
        if (commandExists.sync('ngu')) {
            let cmd = `ngu g project ${params.name} && cd ${params.name} && ngu sync`;
            spinner.text = '${cmd}\n';
            let output = childProcess.execSync(cmd);
            console.log(output);
            if (params.type === 'browser') {
                let pkg = require(pkgPath);
                pkg.scripts.serve = 'ngu serve:webapp';
                pkg.scripts.huidu = 'ngu build:webapp --env=huidu --title=借贷宝 --mis-mode';
                pkg.scripts.prod = 'ngu build:webapp --env=prod --title=借贷宝 --mis-mode';
                fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4));

                /**
                     * @desc 拷贝deploy.json文件
                     */
                gulp.src(templates, {dot: true}).pipe(gulp.dest(projectDir));

                spinner.text = `项目${params.name}初始化完成`;
                spinner.succeed('开始自动安装npm依赖');
                return gulp.src(pkgPath).pipe(install());
            }
        } else {
            spinner.fail('angular2-mobile项目请先安装ngu：\x1B[31mnpm install @jdb/ngu -g\x1B[0m');
        }
        break;
    case 'angular2-pc':
        // ng
        if (commandExists.sync('ng')) {
            let cmd = `ng new ${params.name} --skip-test=true --skip-install=true --routing=true --style=scss --service-worker && cd ${params.name}`;
            spinner.text = `${cmd}\n`;
            let output = childProcess.execSync(cmd, {
                encoding: 'utf8'
            });
            console.log(output);

            /**
                 * @desc jdb专用修复项
                 */
            let angularCli = require('./.angular-cli.json');
            angularCli.apps[0].environments = {
                serve: 'environments/environment.ts',
                dev: 'environments/environment.dev.ts',
                test: 'environments/environment.test.ts',
                huidu: 'environments/environment.huidu.ts',
                prod: 'environments/environment.prod.ts'
            };
            fs.writeFileSync('./.angular-cli.json', JSON.stringify(angularCli, 4));

            gulp.src(templates, {dot: true}).pipe(gulp.dest(projectDir));
            spinner.text = `项目${params.name}初始化完成`;
            spinner.succeed('开始自动安装npm依赖');
            return gulp.src(pkgPath).pipe(install());
        } else {
            spinner.fail('angular2-pc项目请先安装angular-cli：\x1B[31mnnpm install -g @angular/cli@latest\x1B[0m');
        }
        break;
    default:
        let templateParams = Object.assign(
            {
                author: utils.getUser(),
                date: utils.today()
            },
            params
        );
        return gulp
            .src(templates, {dot: true})
            .pipe(template(templateParams))
            .pipe(gulp.dest(projectDir))
            .on('finish', () => {
                spinner.text = `项目${params.name}初始化完成`;
                spinner.succeed('开始自动安装npm依赖');
                gulp.src(pkgPath).pipe(install());
            });
        break;
    }
}
