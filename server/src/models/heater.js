const Channel = require('../channel');

const NAME = 'printer';
const PUB_ADDRESS = `ipc:///tmp/${NAME}_pub_channel`;
const CMD_ADDRESS = `ipc:///tmp/${NAME}_cmd_channel`;

const OUTPUT_NAME = 'output'
const OUTPUT_PUB_ADDRESS = `ipc:///tmp/${OUTPUT_NAME}_pub_channel`

class Heater {
  // The default value if for the PID
  constructor(k = 70, i = 165, d = 16, cycleTime = 1) {
    this.monitor = new Channel.Monitor;
    /* The message example from the heater server
      {
        cycle_time: 5,
        duty_cycle: 70,
        set_point: 80,
        temperature: 26.53,
      }
    */
    this.k = k;
    this.i = i;
    this.d = d;
    this.cycleTime = cycleTime;

    this.monitor.subscribe(PUB_ADDRESS, NAME, null);
    this.cmd = new Channel.CmdChannel(CMD_ADDRESS);

    /* The message example from the output server
     * {
     *  temperature: 60
     * }
     */
    this.monitor.subscribe(OUTPUT_PUB_ADDRESS, OUTPUT_NAME, null)
  }

  get status() {
    /* The status example
      {
        cycle_time: 5,
        duty_cycle: 70,
        set_point: 80,
        temperature: 26.53,
        output_temperature: 60 
      }
    */
    heater_status = this.monitor.getData(NAME);
    output_status = this.monitor.getData(OUTPUT_NAME);

    return {
      ...heater_status,
      ...output_status
    }
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

    this.cmd.send(payload);
  }
}

module.exports = Heater;
