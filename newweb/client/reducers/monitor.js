import { GET_HEATER, SET_TARGET_POINT } from '../constants'

const MAX_NUM_OF_DATASET = 300

const initialState = {
  labels: Array(MAX_NUM_OF_DATASET).fill(''),
  tankTemperatures: Array(MAX_NUM_OF_DATASET).fill(0),
  dutyCycles: Array(MAX_NUM_OF_DATASET).fill(0),
  outputTemperatures: Array(MAX_NUM_OF_DATASET).fill(0),
  setPoints: Array(MAX_NUM_OF_DATASET).fill(0),
  targetSetPoint: null
}

function updateDataset(dataset, value) {
  let copyDataset = dataset.slice()
  copyDataset.push(value)
  if (copyDataset.length > MAX_NUM_OF_DATASET) {
    copyDataset.shift()
  }
  return copyDataset
}

export function monitor(state=initialState, action) {
  switch (action.type) {
    case GET_HEATER.SUCCESS:
      return {
        ...state,
        labels: updateDataset(state.labels, ''),
        tankTemperatures: updateDataset(state.tankTemperatures, action.temperature),
        dutyCycles: updateDataset(state.dutyCycles, action.duty_cycle),
        outputTemperatures: updateDataset(state.outputTemperatures, action.output_temperature),
        setPoints: updateDataset(state.setPoints, action.set_point),
        targetSetPoint: (state.targetSetPoint == null)? action.set_point: state.targetSetPoint
      }
    case SET_TARGET_POINT.SUCCESS:
      return {
        ...state
      }
    case GET_HEATER.FAILURE:
    case SET_TARGET_POINT.FAILURE:
    default:
      return state
  }
}
