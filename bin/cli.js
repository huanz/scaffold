#!/usr/bin/env node

const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

updateNotifier({pkg}).notify({isGlobal: true});

require('yargs')
    .version(pkg.version)
    .usage('yoho <cmd> [args]')
    .command(require('../lib/commands/init'))
    .command(require('../lib/commands/deploy'))
    .demandCommand(1, '请至少输入一个命令！')
    .argv;