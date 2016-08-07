const Channel = require('../channel');

const NAME = 'refill';
const PUB_ADDRESS = `ipc:///tmp/${NAME}_pub_channel`;
const CMD_ADDRESS = `ipc:///tmp/${NAME}_cmd_channel`;

class Refill {
  constructor() {
    this.monitor = new Channel.Monitor;
    /* The message example from the heater server
      {
        full: True
      }
    */
    this.monitor.subscribe(PUB_ADDRESS, NAME, this.update_status);
  }

  isFull() {
    return this.monitor.getData(NAME).full;
  }

  get status() {
    return this.monitor.getData(NAME);
  }

  get lastUpdatedTime() {
    return this.monitor.getLastUpdatedTime(NAME);
  }
}

module.exports = Refill;
