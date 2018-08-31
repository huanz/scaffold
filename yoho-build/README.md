# yoho-build

使用`gulp`和`browserify`进行h5项目的打包

## 安装

```bash
npm i @jdb/yoho-build
```

## 使用

直接在你的`gulpfile.js`里面引入`@jdb/yoho-build`依赖即可使用

```javascript
// gulpfile.js
require('@jdb/yoho-build');
```

## 配置

支持在你的项目目录配置`.yohorc.js`进行项目的个性化配置，下面是默认配置：

```javascript
// .yohorc.js
const SRC = 'src';
const DIST = 'dist';
module.exports = {
    src: SRC,
    dist: DIST,
    style: {
        src: `${SRC}/styles/**/*.{css,sass,scss}`,
        dist: `${DIST}/styles`
    },
    image: {
        src: `${SRC}/images/**`,
        dist: `${DIST}/images`
    },
    font: {
        src: `${SRC}/fonts/*.{ttf,woff,woff2,eot,svg}`,
        dist: `${DIST}/fonts`
    },
    html: {
        src: `${SRC}/**/*.html`,
        dist: DIST
    },
    script: {
        src: `${SRC}/scripts/**/*.js`,
        dist: `${DIST}/scripts`
    },
    browserSync: {
        notify: false,
        logPrefix: 'YOHO',
        open: 'external',
        server: [DIST],
        middleware: [(req, res, next) => {
            req.method = 'GET';
            next();
        }]
    },
    browserify: {
        entries: [`${SRC}/scripts/app.js`],
        debug: argv.debug,
        transform: ['browserify-shim', 'browserify-html']
    },
    autoprefixer: {
        browsers: [
            'ie >= 10',
            'ie_mob >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 7',
            'opera >= 23',
            'ios >= 7',
            'android >= 4.4',
            'bb >= 10'
        ]
    },
    uglify: {
        compress: {
            drop_console: true
        }
    }
};

// 或者一个函数，入参为使用minimist解析完毕的命令行参数
module.exports = (argv) => {
    return {...};
};
```

## API

和之前hybrid开发api写法一致，编译时进行替换：

```javascript
$.post('{{indexApi}}')
```

## 代码检测

`js`使用[eslint](https://github.com/eslint/eslint)进行规范得检查，`sass`使用的[stylelint](https://github.com/stylelint/stylelint)

 支持在项目目录配置 `.eslintrc` 和 `.stylelintrc` 进行规范的扩充。

> 文件名以 `min.{js,sass,scss,css}` 结束将不会被规范检测工具检测

### 代码检测-编辑器配置

**vscode**

安装两款插件：`vscode-eslint` 和 `stylelint`。

然后在`vscode`个人配置里面增加如下配置：

```json
"eslint.autoFixOnSave": true,
"eslint.options": {
    "parserOptions": {
        "ecmaVersion": 9
    },
    "envs": ["node", "browser", "es6", "commonjs", "amd"],
    "extends": ["eslint:recommended"],
    "rules": {
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single", { 
            "allowTemplateLiterals": true
        }],
        "no-cond-assign": "error",
        "comma-dangle": "off",
        "no-unused-vars": "warn",
        "no-console": "off",
        "semi": "warn",
        "camelcase": "warn",
        "no-extend-native": "error",
        "curly": "error",
        "no-empty": ["error", { "allowEmptyCatch": true }]
    }
},
"less.validate": false,
"css.validate": false,
"scss.validate": false,
"stylelint.config": {
    "extends": ["stylelint-config-sass-guidelines"],
    "rules": {
        "indentation": 4,
        "max-nesting-depth": 3
    }
}
```

## browserify-shim

 对于不支持`commonjs`规范的`js`依赖，配置请参考[browserify-shim](https://github.com/thlorenz/browserify-shim)或初始化项目的配置。