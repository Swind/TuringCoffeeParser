class Point {
  constructor(x = null, y = null, f = null) {
    /*
     * x : x aixs
     * y : y aixs
     * z : z aixs
     * f : feed rate
     * t : temperature
     */

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

class Process {
  constructor(params) {
    this.params = params;
    this.points = [];
  }

  get time() {
    return -1;
  }

  get water() {
    return -1;
  }

  get length() {
    return -1;
  }

  radians(degress) {
    return degress * Math.PI / 180;
  }
}

module.exports = {
  Point,
  Process,
};
