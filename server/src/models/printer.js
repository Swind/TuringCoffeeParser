const Channel = require('../channel');

const PRINTER_PUB_ADDRESS = 'ipc:///tmp/printer_pub_channel';
const PRINTER_CMD_ADDRESS = 'ipc:///tmp/printer_cmd_channel';

const PRINTER = 'printer';

class Printer {
  constructor() {
    // The monitor will call the callback function when receive the message from subscribed channel.
    this.monitor = new Channel.Monitor;
    this.monitor.subscribe(PRINTER_PUB_ADDRESS, PRINTER, this.updateStatusByMonitor.bind(this));
    this.cmd = new Channel.CmdChannel(PRINTER_CMD_ADDRESS);

    // Save the latest printer status (Should we save the history of status ?)
    this.status = {};
    this.last_status_update_time = 0;

    this.total_sent_cmd = 0;
  }

  updateStatusByMonitor(data) {
    const updateIfExisting = (name) => {
      if (name in data) {
        this.status[name] = data[name];
      }
    };

    // The printer server will publish three types status.
    // So we need to check the content is existing or not.
    updateIfExisting('state');
    updateIfExisting('state_string');
    updateIfExisting('progress');

    const date = new Date();
    this.last_update_time = date.getTime();
  }

  send_points(points) {
    this.cmd.send({
      "points": points,
    });
  }

  send_cancle() {
    this.cmd.send({
      "cancle": True,
    });
  }
}

module.exports = Printer;
