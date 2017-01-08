import { OPEN_SIDEBAR, CLOSE_SIDEBAR } from '../constants'

const initialState = {
  openSidebar: false
}

export function app(state=initialState, action) {
  switch(action.type) {
    case OPEN_SIDEBAR:
      return {
        ...state,
        openSidebar: true
      }
    case CLOSE_SIDEBAR:
      return {
        ...state,
        openSidebar: false
      }
    default:
      return state
  }
}
