#!/usr/bin/env node

'use strict';
var path = require('path');
var init = require('../commands/init');
var create = require('../commands/create');

require('yargs')
    .usage('yoho <cmd> [args]')
    .config({
        templates: path.join(__dirname, '..', 'templates')
    })
    .command('init [name]', '创建项目', {}, init)
    .command('create', '创建controller、filter、directive', {}, create)
    .help()
    .argv;