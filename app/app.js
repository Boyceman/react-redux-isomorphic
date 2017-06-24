import Koa from 'koa'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import React from 'react'
import { renderToString } from 'react-dom/server'
import reducer from '../client/reducer'
import App from '../src/container/App'
import compress from 'koa-compress'

const app = new Koa()
const port = 3000

app.use(compress({
  threshold: 2048,
  flush: require("zlib").Z_SYNC_FLUSH
}))

app.use(async (ctx, next) => {
  console.log('handle request')
  const store = createStore(reducer)
  ctx.response.type = 'text/html'
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  )
  const preloadedState = store.getState()

  ctx.body = renderPage(html, preloadedState)
})

function renderPage (html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(preloadedState)}
        </script>
      </body>
    </html>
  `
}

app.listen(port, () => {
  console.log(new Date() + '', `listening ${port}`)
})
