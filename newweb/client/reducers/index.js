
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import { cookbook } from './cookbook'
import { editor } from './editor'
import { app } from './app'
import { monitor } from './monitor'

export default combineReducers({
  routing,
  cookbook,
  editor,
  app,
  monitor
})
