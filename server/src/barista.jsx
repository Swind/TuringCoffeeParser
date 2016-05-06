var Channel = require('./channel');

const HEATER_PUB_ADDRESS = 'ipc:///tmp/heater_pub_channel'
const REFILL_PUB_ADDRESS = 'ipc:///tmp/refill_pub_channel'
const PRINTER_PUB_ADDRESS= "ipc:///tmp/printer_pub_channel"

const HEATER_CMD_ADDRESS = 'ipc:///tmp/heater_cmd_channel'
const REFILL_CMD_ADDRESS = 'ipc:///tmp/refill_cmd_channel'
const PRINTER_CMD_ADDRESS= "ipc:///tmp/printer_cmd_channel"

class Barista{
    constructor() {
      this.monitor = new Channel.Monitor;
      this.monitor.subscribe(HEATER_PUB_ADDRESS, 'heater');
      this.monitor.subscribe(REFILL_PUB_ADDRESS, 'refill');
      this.monitor.subscribe(PRINTER_PUB_ADDRESS, 'printer');

      this.heater_cmd = new Channel.CmdChannel(HEATER_CMD_ADDRESS);
      this.refill_cmd = new Channel.CmdChannel(REFILL_CMD_ADDRESS);
      this.printer_cmd = new Channel.CmdChannel(PRINTER_CMD_ADDRESS);
    }

    get_heater_status(){
      return this.monitor.get_data('heater');
    }

    get_refill_status(){
      return this.monitor.get_data('refill');
    }

    get_printer_status(){
      return this.monitor.get_data('printer');
    } 
}
