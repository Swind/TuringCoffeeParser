// MiddleWares
const zAixs = require('./middleware/z-aixs');
const Temperature = require('./middleware/temperature');

class Point {
  constructor(x = null, y = null, f = null) {
    /*
     * x : x aixs
     * y : y aixs
     * z : z aixs
     * f : feed rate
     * t : temperature
     */

    this.type = 'point'
    this.x = x;
    this.y = y;
    this.f = f;
    this.e = 0;
    this.z = null;
    this.t = null;
  }

  get json() {
    return JSON.stringify(this);
  }
}

class Command {
  constructor(command) {
    this.type = 'command'
    this.name = command
  }

  get json() {
    return JSON.stringify(this);
  }
}

class MixCommand extends Command {
  constructor(temperature) {
    super('mix')
    this.t = temperature
  }
}

class CalibrationCommand extends Command {
  constructor(temperature) {
    super('calibration')
    this.t = temperature
  }
}

class HomeCommand extends Command {
  constructor() {
    super('home')
  }
}

class WaitCommand extends Command {
  constructor(second) {
    super('wait')
    this.time = second
  }
}

class Process {
  constructor(params) {
    this.middleWares = [zAixs, Temperature];
    this.params = params;
  }

  registerMiddleWare(middleWare) {
    this.middleWares.push(middleWare);
  }

  get time() {
    return undefined;
  }

  get water() {
    return undefined;
  }

  get length() {
    return undefined;
  }

  get _points(){
    return []
  }

  get points(){
    let points = this._points;

    for (const middleWare of this.middleWares) {
      points = middleWare(points, this.params);
    }

    points = this.post_action(points);

    return points
  }

  radians(degress) {
    return degress * Math.PI / 180;
  }

  post_action(points){
    return points
  }
}

module.exports = {
  Point,
  Process,
  WaitCommand,
  HomeCommand,
  MixCommand,
  CalibrationCommand,
};