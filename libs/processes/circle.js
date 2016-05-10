const Base = require('./base');
const Point = Base.Point;

class Circle extends Base.Process {
  constructor(params) {
    super(params);

    this.length = params.total_water / params.extrudate;
    this.point_number = this.length / this.params.point_interval;

    this.defult = {
      type: 'process',
      name: 'circle',
      radius: {
        start: 20, // mm
      },
      high: {
        start: 170, // mm
        end: 170,
      },
      total_water: 0, // mm
      point_interval: 0.1, // mm
      feedrate: 80, // mm
      extrudate: 0.2, // ml/mm
      temperature: 60, // C
    };
  }

  get time() {
    return this.length / this.params.feedrate * 60;
  }

  get water() {
    return this.params.total_water;
  }

  get length() {
    return this.length;
  }

  get points() {
    const circumference = 2 * Math.pi * this.params.radius.start;
    const cylinder = this.length / circumference;
    const av = (2 * Math.Pi * cylinder) / this.point_number;

    const points = [];

    for (let index = 0; index < this.point_number; index++) {
      const x = this.params.radius * Math.cos(av * index);
      const y = this.params.radius * Math.sin(av * index);
      const f = this.params.feedrate;

      const point = new Point(x, y, f);

      points.push(point);
    }

    return points;
  }
}

module.exports = Circle;
