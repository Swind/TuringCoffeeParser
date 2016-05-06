var Nanomsg = require('nanomsg');

class Monitor {
    constructor() {
      this.subscribers = {};
    }

    update_data(name, msg){
      sub = this.subscribers[name];
      sub.data = JSON.parse(msg);

      if(sub.action != null){
        sub.action(msg);
      }
    }

    subscribe(address, name, action=null){
      sock = Nanomsg.socket('sub');
      sock.connect(address);
      sock.on('data', this.update_data(name));

      sub = {};
      sub.socket = sock;
      sub.name = name; 
      sub.action = action;
      sub.data = {};

      this.subscribers[name] = sub;
    }

    get_data(name){
      sub = this.subscrbiers[name];
      return sub.data;
    }

    close(name){
      this.subscribers[name].socket.close();
      delete this.subscribers[name];
    }

    close_all(){
      for(let [key, value] of this.subscribers){
        value.socket.close();
      }
      this.subscribers = {};
    }
}

class CmdChannel{
    constructor(address, callback=null) {
      this.sock = Nanomsg.socket('pair');
      this.sock.connect(address);
      this.sock.on('data', this.reply_handler.bind(this));

      this.callback = callback;
    }

    reply_handler(msg){
      if(this.callback){
        this.callback(JSON.parse(msg));
      }
    }

    send(json_obj){
      this.sock.send(JSON.stringify(json_obj));
    }

    close(){
      this.sock.close();
    }
}

module.exports = {
  'Monitor': Monitor,
  'CmdChannel': CmdChannel
}

