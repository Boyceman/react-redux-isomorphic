/**
 * Created by boyce on 17-6-24.
 */
import CoreLayout from 'layout/Layout1'
import Home from './Home/component/index'

export default (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: Home(store),
  childRoutes: []
})