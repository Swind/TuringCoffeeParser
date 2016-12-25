const Base = require('./base');
const MixCommand = Base.MixCommand;

const QUICK_MOVE_F = 5000;

class Mix extends Base.Process {

  static get default() {
    return Object.assign({}, {
      type: 'command',
      name: 'mix',
      temperature: 65
    })
  }

  constructor(params) {
    params = params || Mix.default
    super(params);
  }

  get time() {
    return 0;
  }

  get water() {
    return 0;
  }

  get length() {
    return 0;
  }

  get points() {
    return [
      new MixCommand(this.params.temperature),
      new Base.Point(0, 0, QUICK_MOVE_F)
    ];
  }
}

module.exports = Mix;
