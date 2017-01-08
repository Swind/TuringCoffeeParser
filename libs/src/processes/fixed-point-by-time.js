const Base = require('./base');
const Point = Base.Point;

const QUICK_MOVE_F = 5000;

class FixedPointByTime extends Base.Process {

  static get default() {
    return Object.assign({}, {
      type: 'process',
      name: 'fixed_point_by_time',
      coordinates: {
        x: 0, // mm
        y: 0, // mm
      },
      high: {
        start: 300, // mm
        end: 300,
      },
      total_water: 100, // mm
      total_time: 30, // sec
      point_interval: 1.0, // mm
      //feedrate: 80, // mm
      extrudate: 0.2, // ml/mm
      temperature: 60, // C
    })
  }

  constructor(params) {
    params = params || FixedPointByTime.default
    super(params);
    this.point_number = this.length / this.params.point_interval;
  }

  get time() {
    return this.params.total_time;
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

    const feedrate = this.length / t * 60

    // Quick move to the start point.
    let move = new Point(x, y, QUICK_MOVE_F)
    points.push(move)

    for (let i = 0; i < this.length; i++) {
      let p = new Point(null, null, this.params.extrudate)
      p.e = this.water / this.length
      p.f = feedrate
      points.push(p)
    }

    return points;
  }

  post_action(points){
    points[0].e = 0;

    return points;
  }
}

module.exports = FixedPointByTime;
