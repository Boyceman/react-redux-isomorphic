import Koa from 'koa'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import { RouterContext, match } from 'react-router'
import React from 'react'
import { renderToString } from 'react-dom/server'
import reducer from '../client/reducer'
import { helloSaga } from '../client/saga'
import App from '../client/container/App'
import fetchComponentData from '../client/api/fetchComponentData'

const app = new Koa()
const port = 3000

app.use(async (ctx, next) => {
  await next()
  console.log(ctx.req, 'handle request')
  // if (ctx.state.renderProps) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(reducer, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(helloSaga)
  const action = type => store.dispatch({ type })
  ctx.response.type = 'text/html'
  const html = await fetchComponentData(store.dispatch, ctx.state.renderProps.components, ctx.state.renderProps.params)
    .then(() => {
      return renderToString(
        <Provider store={store}>
          <RouterContext {...ctx.state.renderProps} />
        </Provider>
      )
    })
  const preloadState = store.getState()

  ctx.body = renderPage(html, preloadState)
  // }
})

app.use(async (ctx) => {
  match({
    routes: mobileRoutes,
    location: ctx.request.url
  }, (error, redirectLocation, renderProps) => {
    if (error) {
      this.throw(error.message, 500)
    } else if (redirectLocation) {
      this.redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      ctx.state.renderProps = renderProps
    } else {
      this.throw('Not Found', 404)
    }
  })

})

function renderPage (html, preloadState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(preloadState)}
        </script>
      </body>
    </html>
  `
}

app.listen(port, () => {
  console.log(new Date() + '', `listening ${port}`)
})
