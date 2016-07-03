const Base = require('./base');

class SpiralTotalWater extends Base.Process {

  static get default() {
    return Object.assign({}, {
      type: 'process',
      name: 'spiral total water',
      radius: {
        start: 10, // mm
        end: 20, // mm
      },
      high: {
        start: 170, // mm
        end: 170,
      },
      cylinder: 5,
      point_interval: 0.1, // mm
      total_water: 60, // ml
      total_time: 30, // sec
      temperature: 60, // C
    })
  }

  constructor(params) {
    super(params);

    this.created_points = this.generatePoints();
  }

  get time() {
    return this.params.total_time;
  }

  set time(sec) {
    this.params.total_time = sec;
  }

  get water() {
    return this.params.total_water;
  }

  set water(ml) {
    this.params.total_water = ml;
  }

  get length() {
    return this.params.point_interval * (this.created_points.length - 1);
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

    while (totalTheta <= maxTheta) {
      // point interval / (2 * pi * r) = theta for one step
      const nowRadius = a * totalTheta + this.params.radius.start;
      const nowTheta = this.radians((this.params.point_interval / (2 * Math.PI * nowRadius)) * 360);

      totalTheta = totalTheta + nowTheta;

      const x = nowRadius * Math.cos(totalTheta);
      const y = nowRadius * Math.sin(totalTheta);

      // Create the point object to save the information
      points.push(new Base.Point(x, y));
    }

    // f
    const totalLen = this.params.point_interval * (points.length - 1);
    const f = (totalLen * 60) / this.params.total_time;

    for (const point of points) {
      point.f = f;
    }

    return points;
  }
}

module.exports = SpiralTotalWater;
