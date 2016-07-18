
import { handleActions } from 'redux-actions'

const initialState = {
  openSave: false,
  cookbook: undefined,
  message: "Initialing ...",
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
      openSave: false,
      cookbook: cookbook,
      message: message,
    }
  },
  'modify cookbook' (state, action) {
    return {
      openSave: false,
      cookbook: action.payload,
      message: 'Modify cookbook',
    }
  },
  'save cookbook' (state, action) {
    return {
      openSave: true,
      cookbook: state.cookbook,
      message: 'Save cookbook',
    }
  },
}, initialState)
