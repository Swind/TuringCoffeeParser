const Circle = require('./circle');
const FixedPoint = require('./fixed-point');
const Spiral = require('./spiral');
const SpiralTotalWater = require('./spiral-total-water');

// MiddleWares
const zAixs = require('./middleware/z-aixs');
const Temperature = require('./middleware/temperature');

class Process {
  constructor() {
    this.processes = {
      Circle,
      FixedPoint,
      Spiral,
      SpiralTotalWater,
    };

    this.middleWares = [zAixs, Temperature];
  }

  registerMiddleWare(middleWare) {
    this.middleWares.push(middleWare);
  }

  generatePoints(params) {
    const p = new this.processes[params.name](params);

    let points = p.points;

    for (const middleWare of this.middleWares) {
      points = middleWare(points, params);
    }

    return points;
  }
}

module.exports = Process;
