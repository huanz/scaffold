/**
 * gulpfile.js
 * @author bukas
 */
const requireDir = require('require-dir');

requireDir('./gulp/tasks', {
    recurse: true
});