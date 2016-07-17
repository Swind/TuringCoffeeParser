const Base = require('./base');
const Point = Base.Point;

const QUICK_MOVE_F = 5000;

class FixedPoint extends Base.Process {

  static get default() {
    return Object.assign({}, {
      type: 'process',
      name: 'fixed_point',
      coordinates: {
        x: 0, // mm
        y: 0, // mm
      },
      high: {
        start: 300, // mm
        end: 300,
      },
      total_water: 100, // mm
      point_interval: 1.0, // mm
      feedrate: 80, // mm
      extrudate: 0.2, // ml/mm
      temperature: 60, // C
    })
  }

  constructor(params = FixedPoint.default) {
    super(params);

    this.point_number = this.length / this.params.point_interval;
  }

  get time() {
    return (this.params.total_water / this.params.extrudate) / this.params.feedrate * 60;
  }

  get water() {
    return this.params.total_water;
  }

  get length() {
    return this.params.total_water / this.params.extrudate;
  }

  get _points() {
    const x = this.params.coordinates.x;
    const y = this.params.coordinates.y;

    const points = [];

    // Quick move to the start point.
    points.push(new Point(x, y, QUICK_MOVE_F));

    return points;
  }

  post_action(points){
    points[0].e = 0;

    return points;
  }
}

module.exports = FixedPoint;
