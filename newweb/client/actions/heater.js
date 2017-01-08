import { GET_HEATER, SET_TARGET_POINT } from '../constants'

function action(type, payload = {}) {
  return {type, ...payload}
}

export const getHeater = {
  request: () => action(GET_HEATER.REQUEST),
  success: (payload) => action(GET_HEATER.SUCCESS, payload),
  failure: (err) => action(GET_HEATER.FAILURE)
}

export const setTargetPoint = {
  request: (temperature) => action(SET_TARGET_POINT.REQUEST, {temperature}),
  success: (payload) => action(SET_TARGET_POINT.SUCCESS, payload),
  failure: (err) => action(SET_TARGET_POINT.FAILURE)
}
