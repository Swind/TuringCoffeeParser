
import { handleActions } from 'redux-actions'

const initialState = {
  cookbook: undefined,
  message: "Initialing ...",
  openSave: false
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
      message: message,
      openSave: false
    }
  },
  'modify cookbook' (state, action) {
    return {
      cookbook: state.cookbook,
      message: 'Modify cookbook',
      openSave: false
    }
  },
  'save cookbook' (state, action) {
    return {
      cookbook: state.cookbook,
      message: 'Save cookbook',
      openSave: true
    }
  },
}, initialState)
