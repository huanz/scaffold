'use strict';
var fs = require('fs');
var path = require('path');

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

exports.getProjectDir = getProjectDir;
exports.upperFirst = upperFirst;
exports.startsWith = startsWith;