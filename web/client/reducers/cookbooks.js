
import { handleActions } from 'redux-actions'

const initialState = {
  cookbooks: [],
  message: "Initialing ..."
}

export default handleActions({
  'list cookbooks' (state, action) {
    const response = action.payload

    let cookbooks, message
    if (response.status === 200) {
      cookbooks = response.body.data
      message = response.body.message
    } else {
      message = `Error ${response.status}: Failed to get cookbook list`
    }

    return {
      cookbooks: cookbooks,
      message: message
    }
  },
  'load cookbook' (state, action) {
    const response = action.payload

    let cookbook, message
    if (response.status === 200) {
      cookbook = response.body.data
      message = response.body.message
    } else {
      message = `Error ${response.status}: Failed to load cookbook`
    }

    return {
      cookbook: cookbook,
      message: message
    }
  },
}, initialState)
