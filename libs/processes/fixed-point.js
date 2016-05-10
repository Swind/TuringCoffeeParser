const Base = require('./base');
const Point = Base.Point;

const QUICK_MOVE_F = 2000;

class FixedPoint extends Base.Process {
  constructor(params) {
    super(params);

    this.length = params.total_water / params.extrudate;
    this.point_number = this.length / this.params.point_interval;

    this.defult = {
      type: 'process',
      name: 'fixed_point',
      coordinates: {
        x: 0, // mm
        y: 0, // mm
      },
      high: {
        start: 170, // mm
        end: 170,
      },
      total_water: 100, // mm
      point_interval: 0.1, // mm
      feedrate: 80, // mm
      extrudate: 0.2, // ml/mm
      temperature: 60, // C
    };
  }

  get time() {
    return (this.params.total_water / this.params.extrudate) / this.params.feedrate * 60;
  }

  get water() {
    return this.params.total_water;
  }

  get length() {
    return 0;
  }

  get points() {
    const x = this.params.coordinates.x;
    const y = this.params.coordinates.y;

    const points = [];

    // Quick move to the start point.
    points.push(new Point(x, y, QUICK_MOVE_F));

    return points;
  }
}

module.exports = FixedPoint;
