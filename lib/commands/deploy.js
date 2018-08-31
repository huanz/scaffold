/**
 * @file 发布项目至dev/test
 * @author bukas
 */
const path = require('path');
const inquirer = require('inquirer');
const ora = require('ora');
const scp2 = require('scp2');

const config = require('../config');
const utils = require('../common/utils');
const envList = Object.keys(config.deploy);

exports.command = 'deploy';
exports.aliases = 'd';
exports.describe = '部署项目';
exports.builder = {
    env: {
        alias: 'e',
        describe: '部署环境',
        choices: envList
    },
    path: {
        alias: 'p',
        describe: '部署目录',
        type: 'string'
    }
};
exports.handler = (argv) => {
    let prompts = [];
    if (!argv.env) {
        prompts.push({
            type: 'list',
            name: 'env',
            message: '请选择部署环境',
            choices: envList
        });
    }
    if (!argv.path) {
        try {
            let pkg = require(path.join(process.cwd(), 'package.json'));
            prompts.push({
                type: 'input',
                name: 'path',
                message: '请输入部署目录名：',
                default: pkg.name,
                validate: utils.validate
            });
        } catch (error) {
            console.log('请在项目根目录执行该命令');
            return false;
        }
    }
    let params = Object.assign({}, argv);
    delete params._;
    delete params['$0'];

    if (prompts.length) {
        return inquirer.prompt(prompts).then(answers => run(Object.assign(params, answers)));
    } else {
        return run(params);
    }
};

function run(params) {
    const spinner = ora({
        text: '开始部署项目工程',
        spinner: 'hearts'
    }).start();

    if (utils.isEmptyDir('dist')) {
        spinner.fail('请先编译项目或者在项目根目录执行该命令');
        return false;
    }
    let conf = config.deploy[params.env];
    spinner.text = '正在发送文件至远程服务器...';
    scp2.scp('dist/', Object.assign({}, conf, {
        path: path.join(conf.path, params.path)
    }), (error) => {
        if (!error) {
            spinner.succeed(`部署成功：http://h5.${params.env}.jiedaibao.com/${params.path}/`);
        } else {
            spinner.fail(error);
        }
    });
}