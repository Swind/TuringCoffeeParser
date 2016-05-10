const Channel = require('../channel');

const NAME = 'printer';
const PUB_ADDRESS = `ipc:///tmp/${NAME}_pub_channel`;
const CMD_ADDRESS = `ipc:///tmp/${NAME}_cmd_channel`;

class Heater {
  // The default value if for the PID
  constructor(k=70, i=165, d=16, cycleTime=1) {
    this.monitor = new Channel.Monitor;
    /* The message example from the heater server
      {
        cycle_time: 5,
        duty_cycle: 70,
        set_point: 80,
        temperature: 26.53
      }
    */
    this.monitor.subscribe(PUB_ADDRESS, NAME, this.update_status);

    this.cmd = new Channel.CmdChannel(CMD_ADDRESS);
  }

  get status() {
    return this.monitor.getData(NAME);
  }

  get lastUpdatedTime() {
    return this.monitor.getLastUpdatedTime(NAME);
  }

  setTemperature(temperature) {
    const payload = {
      cycle_time: this.cycleTime,
      k: this.k,
      i: this.i,
      d: this.d,
      set_point: temperature,
    };

    this.cmd.send(JSON.stringify(payload));
  }
}

module.exports = Heater;
