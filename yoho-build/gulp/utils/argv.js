const minimist = require('minimist');

let argv = minimist(process.argv.slice(2));

if (argv.debug === undefined) {
    if (argv._[0] === 'build') {
        argv.debug = false;
    } else {
        argv.debug = argv.env != 'prod';
    }
}

module.exports = argv;