#!/usr/bin/env node

'use strict';
var path = require('path');
var init = require('../commands/init');
var create = require('../commands/create');
var gulp = require('../commands/gulp');

require('yargs')
    .usage('yoho <cmd> [args]')
    .config({
        templates: path.join(__dirname, '..', 'templates')
    })
    .command('init [name]', '创建项目', {}, init)
    .command('create', '创建controller、filter、directive', {}, create)
    .command('*', '启动gulp命令', {}, gulp)
    .help()
    .argv;