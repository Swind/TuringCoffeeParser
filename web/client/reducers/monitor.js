import { handleActions } from 'redux-actions'

const initialState = {
  tankTemperature: 0,
  setPoint: 0,
  dutyCycle: 0
}

export default handleActions({
  'get heater status' (state, action) {
    const response = action.payload

    if (response.status === 200) {
      return {
        tankTemperature: response.body.data.temperature,
        setPoint: response.body.data.set_point,
        dutyCycle: response.body.data.duty_cycle
      }
    } else {
      return state
    }
  },
  'update heater status' (state, action) {
    const response = action.payload

    if (response.status === 200) {
      return {
        tankTemperature: response.body.data.temperature,
        setPoint: response.body.data.setPoint,
        dutyCycle: response.body.data.dutyCycle
      }
    } else {
      return state
    }
  }
}, initialState)
