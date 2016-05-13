import spiral from '../libs/processes/spiral'
import circle from '../libs/processes/circle'
import spiralTotalWater from '../libs/processes/spiral-total-water'
import fixedPoint from '../libs/processes/fixed-point'

export const PROCESS = {
  'spiral' : {
    handle: spiral
  },
  'circle': {
    handle: circle
  },
  'fixed_point': {
    handle: fixedPoint
  },
  'spiral total water': {
    handle: spiralTotalWater
  }
}
