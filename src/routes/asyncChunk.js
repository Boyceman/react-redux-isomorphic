/**
 * Created by boyce on 2017/7/12.
 */
import { injectReducer } from 'store/reducers'
import { injectSagas } from 'store/sagas'
import { connect } from 'react-redux'
import FetchFast from 'utils/fetchFast' // FetchFast 库
import forEach from 'lodash/forEach'
import * as selector from 'selector/selector'
import * as FetchFastModel from 'FetchFastModel'
export default (model, APPComponent, store) => {
  let usedFFModel = {}
  forEach(model.FFCombines, s => {
    usedFFModel[s] = FetchFastModel[s]
  })
  const combineFFModels = FetchFast.combine(usedFFModel)
  const Actions = FetchFast.createActions(combineFFModels, model.route.name)
  const ReduxPipe = FetchFast.createReduxPipe(Actions, model.route.name, combineFFModels)
  const ReduxMembrane = FetchFast.createReduxMembrane(Actions, combineFFModels, model.route.name)
  const { fetchDispatch, mapStateToProps } = ReduxPipe
  let selectorProps = {}
  forEach(model.selectors, s => {
    selectorProps[s.key] = selector[s.selector](store)
  })
  const myProps = (stateProps, dispatchProps, ownProps) => {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      ...selectorProps
    }
  }
  const reducer = ReduxMembrane.reducer
  const sagas = ReduxMembrane.sagas
  injectReducer(store, { key: model.route.name, reducer })
  injectSagas(store, { key: model.route.name, sagas })

  return connect(mapStateToProps, fetchDispatch, myProps)(APPComponent.default)
}