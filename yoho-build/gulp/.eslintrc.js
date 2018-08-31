const path = require('path');
const fs = require('fs');

let eslintExtends = ['eslint:recommended'];
let eslintConfig = path.join(process.cwd(), '.eslintrc');

try {
    if (fs.statSync(eslintConfig).isFile()) {
        eslintExtends.push(eslintConfig);
    }
} catch (error) {

}

module.exports = {
    "extends": eslintExtends,
    "rules": {
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single", { "allowTemplateLiterals": true}],
        "comma-dangle": "off",
        "no-cond-assign": "error",
        "no-unused-vars": "warn",
        "no-console": "off",
        "semi": "warn",
        "camelcase": "warn",
        "no-extend-native": "error",
        "curly": "error",
        "no-empty": ["error", { "allowEmptyCatch": true }]
    },
    "env": {
        "browser": true,
        "commonjs": true
    },
    "globals": {
        "$": true,
        "wx": true
    }
}