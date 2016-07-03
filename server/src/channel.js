const Nanomsg = require('nanomsg');
const logger = require('utils/logger');

class Monitor {
  constructor() {
    this.subscribers = {};
  }

  updateData(name, msg) {
    const sub = this.subscribers[name];
    logger.info(msg);
    sub.data = JSON.parse(msg);

    const d = new Date();
    sub.last_updated_time = d.getTime();

    if (sub.action != null) {
      sub.action(msg);
    }
  }

  subscribe(address, name, action = null) {
    const sock = Nanomsg.socket('sub');
    sock.connect(address);
    sock.on('data', this.updateData.bind(this, name));

    const sub = {};
    sub.socket = sock;
    sub.name = name;
    sub.action = action;
    sub.data = {};
    sub.last_updated_time = 0;

    this.subscribers[name] = sub;
  }

  getData(name) {
    let data = {};
    if (name in this.subscribers) {
      data = this.subscribers[name].data;
    }

    return data;
  }

  getLastUpdatedTime(name) {
    const sub = this.subscribers[name];
    return sub.last_updated_time;
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
    this.sock.on('data', this.replyHandler.bind(this));

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
