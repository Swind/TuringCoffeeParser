const Channel = require('./channel');

const HEATER_PUB_ADDRESS = 'ipc:///tmp/heater_pub_channel';
const REFILL_PUB_ADDRESS = 'ipc:///tmp/refill_pub_channel';
const PRINTER_PUB_ADDRESS = 'ipc:///tmp/printer_pub_channel';

const HEATER_CMD_ADDRESS = 'ipc:///tmp/heater_cmd_channel';
const REFILL_CMD_ADDRESS = 'ipc:///tmp/refill_cmd_channel';
const PRINTER_CMD_ADDRESS = 'ipc:///tmp/printer_cmd_channel';

const PRINTER = 'printer';
const REFILL = 'refill';
const HEATER = 'heater';

class Barista {
  constructor() {
    this.monitor = new Channel.Monitor;
    this.monitor.subscribe(HEATER_PUB_ADDRESS, HEATER);
    this.monitor.subscribe(REFILL_PUB_ADDRESS, REFILL);
    this.monitor.subscribe(PRINTER_PUB_ADDRESS, PRINTER);

    this.heater_cmd = new Channel.CmdChannel(HEATER_CMD_ADDRESS);
    this.refill_cmd = new Channel.CmdChannel(REFILL_CMD_ADDRESS);
    this.printer_cmd = new Channel.CmdChannel(PRINTER_CMD_ADDRESS);
  }

  get heater() {
    return this.monitor.get_data(HEATER);
  }

  get refill() {
    return this.monitor.get_data(REFILL);
  }

  get printer() {
    return this.monitor.get_data(PRINTER);
  }
}

module.exports = Barista;
