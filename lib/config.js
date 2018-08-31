/**
 * @file 配置文件
 * @author bukas
 */
const path = require('path');
const utils = require('./common/utils');

let config = {
    cwd: process.cwd(),
    templateDir: path.join(__dirname, '..', 'templates'),
    deploy: {
        dev: {
            host: '100.100.100.100',
            username: 'root',
            password: '111',
            path: '/data/dst/'
        },
        test: {
            host: '100.100.100.101',
            username: 'root',
            password: '111',
            path: '/data/dstnew/'
        }
    }
};

config.type = utils.getDirFiles(config.templateDir).map(file => {
    return {
        value: file,
        templates: utils.getDirFiles(path.join(config.templateDir, file))
    };
});

module.exports = config;