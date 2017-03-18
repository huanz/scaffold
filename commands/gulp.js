var child_process = require('child_process');

module.exports = function () {
    child_process.execFile('gulp', process.argv.slice(2)).stdout.pipe(process.stdout);
};