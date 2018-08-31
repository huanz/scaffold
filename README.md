# yoho-cli

```
npm i yoho-cli -g
```

## usage

```
yoho help
```

命令：

  - init [name]  创建项目
  - deploy [env] [path] 部署项目至dev、test

### 初始化项目模板

执行如下命令将会告诉你如何使用：

```
yoho init --help
```

模板分为两类：`client`端内项目模板，`browser`端外浏览器项目模板

其中端外`browser`项目分为 `default` 和 `angular2`

`default`为自由定制的非`angular2`项目，使用[yoho-build](./yoho-build)进行打包，具体打包配置请参考[yoho-build](./yoho-build)文档。

### 发布dist目录文件至dev、test

执行如下命令将会告诉你如何使用：

```bash
yoho deploy --help
```

如果直接执行`yoho deploy`将会出现交互式命令，可根据提示进行部署：

```
? 请选择部署环境 test
? 请输入部署目录名：
```

`dev`将部署到`h5.dev.com`
`test`将部署到`h5.test.com`

部署目录名即为远程机器的访问目录名，如 `demo`，将会部署到 `h5.{env}.com/demo/`

也可以直接执行`yoho deploy -e test -p demo`将本地`dist`目录文件发布至`test`机器的`demo`目录。
