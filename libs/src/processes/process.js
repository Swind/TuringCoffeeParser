const Circle = require('./circle');
const FixedPoint = require('./fixed-point');
const Spiral = require('./spiral');
const SpiralTotalWater = require('./spiral-total-water');
const Wait = require('./wait');
const Home = require('./home');
const Move = require('./move');
const Calibration = require('./calibration');
const Mix = require('./mix');

var _processes = {
  "mix": Mix,
  "calibration": Calibration,
  "circle": Circle,
  "fixed_point": FixedPoint,
  "spiral": Spiral,
  "spiral total water": SpiralTotalWater,
  "wait": Wait,
  "home": Home,
  "move": Move,
}

function createProcess(params){
    return new _processes[params.name](params);
}

module.exports = {
  createProcess
}
