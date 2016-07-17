const Base = require('./base');
const Point = Base.Point;

const QUICK_MOVE_F = 5000;

class Move extends Base.Process {

  static get default() {
    return Object.assign({}, {
      type: 'process',
      name: 'move',
      coordinates: {
        x: 0,
        y: 0,
      },
      high: {
        start: 300,
      },
    })
  }

  constructor(params = Move.default) {
    super(params);
  }

  get time() {
    return 0;
  }

  get water() {
    return 0;
  }

  get length() {
    return 1;
  }

  get _points() {
    const x = this.params.coordinates.x;
    const y = this.params.coordinates.y;

    const points = [];

    // Quick move to the start point.
    let move = new Point(x, y, QUICK_MOVE_F)
    points.push(move)

    return points;
  }
}

module.exports = Move;
