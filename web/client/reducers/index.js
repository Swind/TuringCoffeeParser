
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import cookbooks from './cookbooks'
import editor from './editor'

export default combineReducers({
  routing,
  cookbooks,
  editor
})
