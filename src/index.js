import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './container/App'
import reducer from '../src/reducer'

// 通过服务端注入的全局变量得到初始 state
const preloadedState = window.__INITIAL_STATE__

// 使用初始 state 创建 Redux store
const store = createStore(reducer, preloadedState)
const MOUNT_NODE = document.getElementById('root')

let render = () => {
  const routes = require('././routes/index').default(store)

  ReactDOM.render(
    <Provider store={store} routes={routes}>
      <App />
    </Provider>,
    MOUNT_NODE
  )
}

// This code is excluded from production bundle
if (process.env.NODE_ENV === 'dev') {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error}/>, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        console.error(error)
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// ========================================================
// Go!
// ========================================================
render()
