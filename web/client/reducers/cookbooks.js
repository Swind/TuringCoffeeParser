
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
  'create cookbook' (state, action) {
    const response = action.payload

    let cookbooks, message
    if (response.status === 200) {
      cookbooks = response.body.data
      message = response.body.message
    } else {
      message = `Error ${response.status}: Failed to create cookbook`
    }

    return {
      cookbooks: state.cookbooks,
      message: message
    }
  },
  'remove cookbook' (state, action) {
    const response = action.payload

    let cookbooks, message
    if (response.status === 200) {
      cookbooks = response.body.data
      message = response.body.message
    } else {
      message = `Error ${response.status}: Failed to remove cookbook`
    }

    return {
      cookbooks: state.cookbooks,
      message: message
    }
  }
}, initialState)
