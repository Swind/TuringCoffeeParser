var Channel = require('./channel');

const PRINTER_PUB_ADDRESS= "ipc:///tmp/printer_pub_channel"
const PRINTER_CMD_ADDRESS= 'ipc:///tmp/printer_cmd_channel'

const PRINTER = 'printer'

class Printer{
    constructor() {
      this.monitor = new Channel.Monitor;
      this.cmd = new Channel.CmdChannel(PRINTER_CMD_ADDRESS);

      this.monitor.subscribe(PRINTER_PUB_ADDRESS, PRINTER);
    }

    get status(){
      return this.monitor.get_data(PRINTER);
    } 

    send(msg){
      this.cmd.send(msg);
    }
}

module.exports = Printer 
