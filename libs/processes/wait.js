const Base = require('./base');
const WaitCommand = Base.WaitCommand;


class Wait extends Base.Process {

  static get default() {
    return Object.assign({}, {
      type: 'process',
      name: 'wait',
      total_time: 30
    })
  }

  constructor(params = Wait.default) {
    super(params);
  }

  get time() {
    return this.params.time;
  }

  get water() {
    return 0;
  }

  get length() {
    return 0;
  }

  get points() {
    return [
      WaitCommand(this.params.total_time)
    ];
  }
}

export default Wait;
