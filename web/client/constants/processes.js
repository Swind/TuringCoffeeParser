import spiral from 'libs/processes/spiral'
import circle from 'libs/processes/circle'
import spiralTotalWater from 'libs/processes/spiral-total-water'
import fixedPoint from 'libs/processes/fixed-point'
import wait from 'libs/processes/wait'
import home from 'libs/processes/home'
import move from 'libs/processes/move'
import calibration from 'libs/processes/calibration'
import mix from 'libs/processes/mix'

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
  },
  'wait': {
    handle: wait
  },
  'home': {
    handle: home
  },
  'move': {
    handle: move
  },
  'calibration': {
    handle: calibration
  },
  'mix': {
    handle: mix
  }
}
