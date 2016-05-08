var Channel = require('./channel');

const PRINTER_PUB_ADDRESS= "ipc:///tmp/printer_pub_channel"
const PRINTER_CMD_ADDRESS= 'ipc:///tmp/printer_cmd_channel'

const PRINTER = 'printer'

class Printer{
    constructor() {
      this.monitor = new Channel.Monitor;
      this.cmd = new Channel.CmdChannel(PRINTER_CMD_ADDRESS);

      this.monitor.subscribe(PRINTER_PUB_ADDRESS, PRINTER, this.update_status_by_monitor.bind(this));

      this.status = {};
      this.last_status_update_time = 0; 

      this.total_sent_cmd = 0;
    }

    update_status_by_monitor(data){

      update_if_existing = (name) => {
        if (name in data){
          this.status[name] = data[name];
        }
      }

      update_if_existing('state');
      update_if_existing('state_string');
      update_if_existing('progress');

      let date = new Date();
      this.last_update_time = date.getTime();
    }

    send(cmd){
      this.cmd.send({'C': cmd});
    }

    batch_send(cmds){
      this.cmd.send({'G': cmds});
    }

    home(){
      this.cmd.send({'C': 'G28'});
    }
}

module.exports = Printer 
