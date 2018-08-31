/**
 * @file 工具方法
 * @author bukas
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const rimraf = require('rimraf');
const childProcess = require('child_process');

const config = require('../config');

exports.getDirFiles = (dir) => {
    return fs.readdirSync(dir).filter(file => !file.startsWith('.'));
};

exports.validate = (value) => {
    if (/^\w+$/.test(value)) {
        return true;
    }
    return '必须为字母、数字、下划线';
};

/**
 * 检测目录名是否合法，并且是否有同名文件
 * @param {string} value 
 */
exports.validDir = (value) => {
    let valid = exports.validate(value);
    if (valid === true) {
        try {
            if (fs.statSync(path.join(config.cwd, value)).isFile()) {
                return '当前目录存在同名文件';
            }
            return valid;
        } catch (error) {
            return valid;
        }
    } else {
        return valid;
    }
};

exports.getUser = () => {
    if (os.userInfo) {
        return os.userInfo().username;
    }
    let env = process.env;
    let envVar = env.USER || env.SUDO_USER || env.LOGNAME || env.LNAME || env.USERNAME;
    if (envVar) {
        return envVar;
    }
    try {
        if (process.platform === 'darwin' || process.platform === 'linux') {
            return childProcess.spawnSync('id', ['-un'], {
                encoding: 'utf-8'
            }).stdout.replace('\n', '');
        } else if (process.platform === 'win32') {
            return childProcess.spawnSync('whoami', {
                encoding: 'utf-8'
            }).stdout.replace(/^.*\\/, '');
        }
    } catch (error) {}
};

const padStart = (str, len = 2, padString = ' ') => {
    str += '';
    if (str.length >= len) {
        return str;
    } else {
        len = len - str.length;
        if (len > padString.length) {
            padString += padString.repeat(len / padString.length);
        }
        return padString.slice(0, len) + str;
    }
};

exports.padStart = padStart;

/**
 * 格式化输出今天 YYYY-MM-dd
 */
exports.today = (d = new Date()) => {
    return d.getFullYear() + '-' + padStart(d.getMonth() + 1, 2, '0') + '-' + padStart(d.getDate(), 2, '0');
};

/**
 * 是否是目录
 * @param {string} dir 
 * @return {boolean}
 */
exports.isDir = (dir) => {
    try {
        return fs.statSync(dir).isDirectory();
    } catch (error) {
        return false;
    }
};

/**
 * 是否是空目录
 * @param {string} dir 目录
 * @return {boolean}
 */
exports.isEmptyDir = (dir) => {
    try {
        return !fs.readdirSync(dir).length;
    } catch (error) {
        return true;
    }
};

/**
 * 空目录
 * @param {string} dir 
 */
exports.emptyDir = (dir) => {
    try {
        let items = fs.readdirSync(dir);
        items.forEach(item => {
            rimraf.sync(path.join(dir, item), {
                glob: false
            });
        });
        return true;
    } catch (error) {
        return fs.mkdirSync(dir);
    }
};