const Base = require('./base');
const Point = Base.Point;

class Spiral extends Base.Process {

  static get default() {
    return Object.assign({}, {
      type: 'process',
      name: 'spiral',
      radius: {
        start: 10, // mm
        end: 20, // mm
      },
      high: {
        start: 300, // mm
        end: 300,
      },
      cylinder: 5,
      point_interval: 2.0, // mm
      feedrate: 80, // mm
      extrudate: 0.2, // ml/mm
      temperature: 60, // C
    })
  }

  constructor(params = Spiral.default) {
    super(params);
    this.created_points = this.generatePoints();
  }

  get time() {
    return this.length / this.params.feedrate * 60;
  }

  get water() {
    return this.created_points.length * this.params.extrudate;
  }

  get length() {
    return this.created_points.length * this.params.point_interval;
  }

  get _points() {
    return this.created_points;
  }

  generatePoints() {
    const maxTheta = this.radians(this.params.cylinder * 360);
    // a is acceleration
    const a = (this.params.radius.end - this.params.radius.start) / maxTheta;

    let totalTheta = 0;
    const points = [];

    const e = this.params.extrudate;
    while (totalTheta <= maxTheta) {
      // point interval / (2 * pi * r) = theta for one step
      const nowRadius = a * totalTheta + this.params.radius.start;
      const nowTheta = this.radians((this.params.point_interval / (2 * Math.PI * nowRadius)) * 360);

      totalTheta = totalTheta + nowTheta;

      const x = nowRadius * Math.cos(totalTheta);
      const y = nowRadius * Math.sin(totalTheta);

      let p = new Point(x, y, this.params.feedrate);
      p.e = e;
      // Create the point object to save the information
      points.push(p);
    }
    return points;
  }
}

module.exports = Spiral;
