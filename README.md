# isomorphic-redux-app

> isomorphic-redux-app

##技术栈

- webpack2
- react
- react-router
- redux
- server rendering
- fetch
- express

## 升级

### 2016/11/12

- 1. 新增 `webpack-visualizer-plugin`(可视化分析webpack包)

- 2.

1. 简单的tap事件，请使用 [react-tap-event-plugin](https://github.com/zilverline/react-tap-event-plugin)
2. 复杂的tap事件，建议使用tap component

- 3. ~~seamless-immutable(替换`immutable`)(`seamless-immutable`把很多简易的语法都去掉了, 所以放弃使用了)~~

与 Immutable.js 学院派的风格不同，seamless-immutable 并没有实现完整的 Persistent Data Structure，而是使用 `Object.defineProperty`（因此只能在 IE9 及以上使用）扩展了 JavaScript 的 `Array` 和 `Object` 对象来实现，只支持 Array 和 Object 两种数据类型，API 基于与 Array 和 Object 操持不变。

- 4. 引入 `react-immutable-render-mixin` 会依赖 `immutable`(压缩后, 总包会大 100k 以上 )


##BUG

### 2016/11/12

- 1.
~~原因：`Webpack 2.1.0-beta23` 之后的config里不能直接包含自定义配置项
解决：将`postcss`和`devServer`替换成以下写法即可~~

```js
plugins: {
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: function () {
        return [precss, autoprefixer];
      },
      devServer: {
        contentBase: "src", //本地服务器所加载的页面所在的目录
        colors: true, //终端中输出结果为彩色
        historyApiFallback: true, //不跳转
        inline: true //实时刷新
      }
    }
  })
}
```

- 2. `server.js` 未能跑起来(即是服务端渲染还没能用)