import { handleActions } from 'redux-actions'

const initialState = {
  tankTemperature: 0.0,
  setPoint: 0.0,
  dutyCycle: 0.0,
  outputTemperature: 0.0
}

export default handleActions({
  'get heater status' (state, action) {
    const response = action.payload

    if (response.status === 200) {
      return {
        tankTemperature: (response.body.data.temperature === undefined)? state.tankTemperature: response.body.data.temperature,
        setPoint: (response.body.data.set_point === undefined)? state.setPoint: response.body.data.set_point,
        dutyCycle: (response.body.data.duty_cycle === undefined)? state.dutyCycle: response.body.data.duty_cycle,
        outputTemperature: (response.body.data.output_temperature === undefined)? state.outputTemperature: response.body.data.output_temperature
      }
    } else {
      return state
    }
  },
  'update heater status' (state, action) {
    const response = action.payload

    if (response.status === 200) {
      return state
    } else {
      return state
    }
  }
}, initialState)
