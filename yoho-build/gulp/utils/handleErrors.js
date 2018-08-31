const notify = require('gulp-notify');

module.exports = function (...args) {
    notify.onError({
        title: 'Compile Error',
        message: '<%= error %>'
    }).apply(this, args);
    this.emit('end');
};