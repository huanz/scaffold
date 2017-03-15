'use strict';
var fs = require('fs');
var path = require('path');
var os = require('os');
var child_process = require('child_process');

var cwd = process.cwd();

var existsPackage = function (filepath) {
    return fs.existsSync(path.join(filepath, 'package.json'));
};

var getProjectDir = function (name) {
    var temp = null;
    if (existsPackage(cwd)) {
        return cwd;
    } else if (name) {
        temp = path.join(cwd, name);
        if (!existsPackage(temp)) {
            if (!fs.existsSync(temp)) {
                fs.mkdirSync(temp);
            }
        }
        return temp;
    } else {
        return false;
    }
};

var upperFirst = function (string) {
    var chr = string.charAt(0);
    var trailing = string.slice(1);
    return chr.toUpperCase() + trailing;
};

var startsWith = function (string, target) {
    return string.slice(0, target.length) === target;
};

exports.validate = function (value) {
    if (/^\w+$/.test(value)) {
        return true;
    }
    return '必须为字母、数字、下划线';
};

exports.getUser = function () {
    var env = null;
    var envVar = '';
    if (os.userInfo) {
        return os.userInfo().username;
    }
    env = process.env;
    envVar = env.USER || env.SUDO_USER || env.LOGNAME || env.LNAME || env.USERNAME;
    if (envVar) {
        return envVar;
    }
    try {
        if (process.platform === 'darwin' || process.platform === 'linux') {
            return child_process.spawnSync('id', ['-un'], {
                encoding: 'utf-8'
            }).stdout.replace('\n', '');
        } else if (process.platform === 'win32') {
            return child_process.spawnSync('whoami', {
                encoding: 'utf-8'
            }).stdout.replace(/^.*\\/, '');
        }
    } catch (error) {}
};

exports.getProjectDir = getProjectDir;
exports.upperFirst = upperFirst;
exports.startsWith = startsWith;