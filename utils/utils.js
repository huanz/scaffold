'use strict';
var fs = require('fs');
var path = require('path');
var os = require('os');
var child_process = require('child_process');
var LineByLineReader = require('line-by-line');

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

var pad = function (num) {
    return num > 9 ? num : ('0' + num);
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

exports.isHybridx = function (dir) {
    var appjs = path.join(dir, 'app', 'scripts', 'app.js');
    if (fs.existsSync(appjs)) {
        return /JDBModule\.register/.test(fs.readFileSync(appjs).toString());
    }
    console.log('请先创建app.js');
    return -1;
};

exports.now = function () {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
};

exports.insertRequire = function (dir, type, file) {
    var appjs = path.join(dir, 'app', 'scripts', 'app.js');
    var insertText = "require('./" + type + "s/" + file + "');";
    var content = fs.writeFileSync(appjs);
    var lr = null;
    var results = [];
    // 是否已经插入
    var inserted = false;
    var lines = {
        require: 0,
        service: 0,
        controller: 0
    };
    if (content.indexOf(insertText) === -1) {
        lr = new LineByLineReader(appjs);
        lr.on('line', function (line) {
            results.push(line);
            if (/require/.test(line)) {
                if (!lines.require) {
                    lines.require = results.length - 1;
                }
                if (/service/.test(line)) {
                    lines.service = results.length - 1;
                }
                if (/controller/.test(line)) {
                    lines.controller = results.length - 1;
                }
                /**匹配到当前类型直接插入 */
                if (!inserted && new RegExp(type).test(line)) {
                    results.push(insertText);
                    inserted = true;
                }
            }
        });
        lr.on('end', function () {
            var position = lines[type] || (lines.controller - 1) || lines.require;
            if (!inserted) {
                results.splice(position, 0, insertText);
            }
            fs.writeFile(appjs, results.join('\n'), function () {

            });
        });
    }
};


exports.getProjectDir = getProjectDir;
exports.upperFirst = upperFirst;
exports.startsWith = startsWith;