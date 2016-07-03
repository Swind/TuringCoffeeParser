const Circle = require('./circle');
const FixedPoint = require('./fixed-point');
const Spiral = require('./spiral');
const SpiralTotalWater = require('./spiral-total-water');
const Wait = require('./wait');
const Home = require('./home');

// MiddleWares
const zAixs = require('./middleware/z-aixs');
const Temperature = require('./middleware/temperature');

var _process = {
  "circle": Circle,
  "fixed_point": FixedPoint,
  "spiral": Spiral,
  "spiral_total_water": SpiralTotalWater,
  "wait": Wait,
  "home": Home,
}

function createProcess(params){
    return new _processes[params.name](params);
}

class Process {
  constructor() {
    this.middleWares = [zAixs, Temperature];
  }

  registerMiddleWare(middleWare) {
    this.middleWares.push(middleWare);
  }

  get _points(){
    return []
  }

  get points(){
    let points = this._points();

    for (const middleWare of this.middleWares) {
      points = middleWare(points, params);
    }

    return points 
  }
}

module.exports = {
  Process,
  createProcess
}
