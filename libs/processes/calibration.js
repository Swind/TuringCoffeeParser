const Base = require('./base');
const CalibrationCommand = Base.CalibrationCommand;

class Calibration extends Base.Process {

  static get default() {
    return Object.assign({}, {
      type: 'command',
      name: 'calibration'
    })
  }

  constructor(params = Mix.default) {
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
      new CalibrationCommand()
    ];
  }
}

module.exports = Calibration;
