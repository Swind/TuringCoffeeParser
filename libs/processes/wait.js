const Base = require('./base');
const WaitCommand = Base.WaitCommand;


class Wait extends Base.Process {

  static get default() {
    return Object.assign({}, {
      type: 'command',
      name: 'wait',
      total_time: 30
    })
  }

  constructor(params = Wait.default) {
    super(params);
  }

  get time() {
    return this.params.total_time;
  }

  get water() {
    return 0;
  }

  get length() {
    return 0;
  }

  get points() {
    return [
      new WaitCommand(this.params.total_time)
    ];
  }
}

module.exports = Wait;
