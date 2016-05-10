const Nanomsg = require('nanomsg');
const logger = require('../libs/utils/logger');

class Monitor {
  constructor() {
    this.subscribers = {};
  }

  updateData(name, msg) {
    const sub = this.subscribers[name];
    sub.data = JSON.parse(msg);

    if (sub.action != null) {
      sub.action(msg);
    }
  }

  subscribe(address, name, action = null) {
    const sock = Nanomsg.socket('sub');
    sock.connect(address);
    sock.on('data', this.update_data(name));

    const sub = {};
    sub.socket = sock;
    sub.name = name;
    sub.action = action;
    sub.data = {};

    this.subscribers[name] = sub;
  }

  getData(name) {
    const sub = this.subscrbiers[name];
    return sub.data;
  }

  close(name) {
    this.subscribers[name].socket.close();
    delete this.subscribers[name];
  }

  closeAll() {
    for (const [key, value] of this.subscribers) {
      logger.info(`Close the ${key} channel`);
      value.socket.close();
    }
    this.subscribers = {};
  }
}

class CmdChannel {
  constructor(address, callback = null) {
    this.sock = Nanomsg.socket('pair');
    this.sock.connect(address);
    this.sock.on('data', this.reply_handler.bind(this));

    this.callback = callback;
  }

  replyHandler(msg) {
    if (this.callback) {
      this.callback(JSON.parse(msg));
    }
  }

  send(jsonObj) {
    this.sock.send(JSON.stringify(jsonObj));
  }

  close() {
    this.sock.close();
  }
}

module.exports = {
  Monitor,
  CmdChannel,
};
