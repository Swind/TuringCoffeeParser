const Base = require('./base');
const Move = require('./move');
const FixedPoint = require('./fixed-point');

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
      new MixCommand(self.params.temperature)
    ];
  }
}

module.exports = Mix;
