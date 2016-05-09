
import { handleActions } from 'redux-actions'

const initialState = {
  cookbook: undefined,
  message: "Initialing ..."
}

export default handleActions({
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
