/**
 * Created by boyce on 2017/7/12.
 */
import model from './model'

export default (store) => ({
  path: model.route.router,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const APPComponent = require(`../component`)
      let asyncChunk = require('routes/asyncChunk').default
      const APP = asyncChunk(model, APPComponent, store)
      cb(null, APP)
    }, 'Home')
  }
})