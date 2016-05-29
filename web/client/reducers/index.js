
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import cookbooks from './cookbooks'
import editor from './editor'
import monitor from './monitor'

export default combineReducers({
  routing,
  cookbooks,
  monitor,
  editor
})
