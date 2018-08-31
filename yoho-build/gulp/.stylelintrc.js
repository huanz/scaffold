const path = require('path');
const fs = require('fs');

let stylelintExtends = ['stylelint-config-sass-guidelines'];
let stylelintConfig = path.join(process.cwd(), '.stylelintrc');

try {
    if (fs.statSync(stylelintConfig).isFile()) {
        stylelintExtends.push(stylelintConfig);
    }
} catch (error) {

}

module.exports = {
    "extends": stylelintExtends,
    "rules": {
        "indentation": 4,
        "max-nesting-depth": 3
    }
}