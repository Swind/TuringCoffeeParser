const Circle = require('./circle');
const FixedPoint = require('./fixed-point');
const Spiral = require('./spiral');
const SpiralTotalWater = require('./spiral-total-water');
const Wait = require('./wait');
const Home = require('./home');
const Move = require('./move');

var _processes = {
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
