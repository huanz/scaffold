# <%= name %>

## hybridx调试

1. iOS

    1. 将`mybankv21/phpsync/sync/hybrid/getCodeFile`接口响应粘贴至`creditCard/temp/getCodeFile.json`

    2. Charles Map Local `mybankv21/phpsync/sync/hybrid/getCodeFile` 至 `creditCard/temp/getCodeFile.json`

2. Android

    1. 在Mac安装ADB调试工具：`brew install android-platform-tools`（已安装忽略）
    
    2. 将手机连接至电脑。

3. 拷贝该项目的`gulpfile.js`至你的项目的`gulpfile.js`

4. 运行：`gulp hybridx`

**重要提示**

> iOS修改代码需要杀进程重新进入。
>
> iOS的调试方法对于Android也是适用的，但是需要注意切换平台`platform`时切记重新拷贝一下`mybankv21/phpsync/sync/hybrid/getCodeFile`接口的响应，不同平台的包可能不一样，如：`core`。
> 
> 建议安卓直接使用ADB调试。


### 参数

`--platform=ios|android`, default: `ios`

`--env test`, default: `test`