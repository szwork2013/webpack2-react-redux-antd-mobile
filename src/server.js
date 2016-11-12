/**
 *完善的 Compponent 属性及生命周期与客户端的 render 时机是 React 同构的关键。
DOM 的一致性
在前后端渲染相同的 Compponent，将输出一致的 Dom 结构。
不同的生命周期
在服务端上 Component 生命周期只会到 componentWillMount，客户端则是完整的。
客户端 render 时机
同构时，服务端结合数据将 Component 渲染成完整的 HTML 字符串并将数据状态返回给客户端，客户端会判断是否可以直接使用或需要重新挂载。
 *
 */

import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { RoutingContext, match } from 'react-router'
import { Provider } from 'react-redux'
import routes from './routes'
import configureStore from './configureStore'
// import configureStore from './store'

const app = express()

function renderFullPage(html, initialState) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      <div id="root">
        <div>
          ${html}
        </div>
      </div>
      <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
      </script>
      <script src="/index.bundle.js"></script>
    </body>
    </html>
  `
}

app.use((req, res) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      res.status(500).end(`Internal Server Error ${err}`)
    } else if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      const store = configureStore()
      const state = store.getState()

      Promise.all([
        store.dispatch(fetchList()),
        store.dispatch(fetchItem(renderProps.params.id))
	  ])
      .then(() => {
        const html = renderToString(
          <Provider store={store}>
            <RoutingContext {...renderProps} />
          </Provider>
        )
        res.end(renderFullPage(html, store.getState()))
      })
    } else {
      res.status(404).end('Not found')
    }
  })
})