const Base = require('./base');
const HomeCommand = Base.HomeCommand;


class Home extends Base.Process {

  static get default() {
    return Object.assign({}, {
      type: 'command',
      name: 'home',
    })
  }

  constructor(params) {
    params = params || Home.default
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
      new HomeCommand()
    ];
  }
}

module.exports = Home
