/**
 * Created by boyce on 2017/6/7.
 */
export default (dispatch, Component, params) => {
  const needs = Component.reduce((prev, current) => {
    return current ? (current.needs || []).concat(prev) : prev
  }, [])

  const promises = needs.map(need => dispatch(need(params)))
  return Promise.all(promises)
}