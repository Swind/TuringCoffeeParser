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
    this.command = command
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
    this.params = params;
    this._points = [];
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

  get points() {
    return this._points
  }

  set points(points) {
    this._points = points
  }

  radians(degress) {
    return degress * Math.PI / 180;
  }
}

module.exports = {
  Point,
  Process,
};
