# 前端监控

## 什么是前端监控？

前端监控是相对于后端监控提出的。
监控JS的执行错误，语法错误，资源加载错误，HTTP请求错误(这部分也可以后端监控.)。
也指性能监控，监控页面的加载时间，DNS解析时间等（利用原生提供的performance API来实现）

## 如何接入错误监控

使用的方法: 有`window.onerror` 或者 采用 `try,catch`

两者比较：

`try,catch`

1. 无法捕捉到语法错误，只能捕捉运行时错误；
2. 可以拿到出错的信息，堆栈，出错的文件、行号、列号；
3. 需要借助工具把所有的function块以及文件块加入try,catch，可以在这个阶段打入更多的静态信息。
4. window.onerror的方案有如下特点：

`window.onerror`

1. 可以捕捉语法错误，也可以捕捉运行时错误；
2. 可以拿到出错的信息，堆栈，出错的文件、行号、列号；
3. 只要在当前页面执行的js脚本出错都会捕捉到，例如：浏览器插件的javascript、或者flash抛出的异常等
4. 跨域的资源需要特殊头部支持。
5. window.onerror实际上采用的事件冒泡的机制捕获异常，并且在冒泡(bubble)阶段时才触发，因此像网络请求异常这些不会冒泡的异常是无法捕获的。

可以通过script标签来引入监控SDK，
也可以通过npm将监控代码接入到项目中

使用vue的话，需要在vue提供的错误劫持钩子`errorHandler`中进行配置

用法

``` vue
Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
  // 只在 2.2.0+ 可用
}
```

Promise报错，`onerror`事件是捕获不到的。

对于Promise的错误，需要在每个Promise后面添加catch来捕获，
或者监听`unhandledrejection`事件，不过`unhandledrejection`在浏览器的兼容不是很好
只有PC端`Chrome`和`Safari`支持

如果是对于用户基数大，且宿主环境多样的产品来说，使用`unhandledrejection`不太可行，还是得手动添加`catch`来捕获error

![](https://ws1.sinaimg.cn/large/ad9f1193gy1fte1378u45j20za0llgnw.jpg)

## 上报错误的完整性（遇到跨域脚本，如何做上报，监控哪些指标）

### 跨域问题

如果是所引用的跨域脚本发生错误，那么报错都是`Script Error`，因为一般的错误捕获方法`window.onerror()`，捕获不到跨域资源的报错。
所以放在其他域(cdn提供商)下的资源需要设置`crossorigin`属性。CDN对该资源的响应信息首部需要设置`Access-Control-Allow-Origin`字段，把允许访问该资源的域名添加进去。不过现在CDN提供商，该字段设置的一般都是`*`，代表其他的所有外域都可以跨域访问该资源。

### 如何做上报

对于一个用户量庞大的产品来说，对上报的错误信息需要进行筛选。

由于上报所需要的开销会比较多，因为每次进行HTTP/1.X的请求，都要发送很多header字段，可以考虑先将需要上报的信息收集，到达一个阈值再进行传输。

或者利用HTTP/2.0协议来进行传输，可以压缩首部数据大小，也可以使用多路复用来加快数据传输。

### 监控指标

监控用户的核心交互操作行为。（需要将用户的详细信息一并上传，uid，user-agent，时间，所操作的DOM元素，等信息）
监控页面加载时间（可以继续细分）
监控HTTP请求错误信息
监控资源错误信息

## 监控系统错误展示方式

图表信息展示

图： 曲线图（x轴为时间）

表：错误信息统计表/页面性能统计表

## 能否在监控系统中定位错误

因为前端代码文件都是经过打包工具压缩过的，所以在不开启sourcemap的情况下，是定位不到实际发生错误的代码的行列位置

需要上传sourceMap文件，分析sourceMap文件，可以定位具体发生错误的代码。

如果是使用node来做中间层的话，可以将sourcemap文件的解析工作交给中间层，或者直接交给服务端解析.

## TODOLIST

- [ ] 监控JS执行错误
- [ ] 监控HTTP请求错误
- [ ] 监控页面加载性能