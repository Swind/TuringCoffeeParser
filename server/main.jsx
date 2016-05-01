'use strict';

const logger = require('../utils/logger');
const Hapi = require('hapi');
const CookbookMgr = require('./models/cookbooks');

class APIServer {
    constructor(address = "127.0.0.0", port = 3000) {
        this.address = address;
        this.port =port;

        // HTTP Server
        this.server = new Hapi.Server();
        this.server.connection({address: this.address, port: this.port});
    }


    add_route(method, path, handler) {
      this.server.route(
        {
          method: method,
          path: path,
          handler: handler
        }
      );
    }

    start() {
      logger.info("Start the API server ...");
      
      this.server.start((err)=>{
        if (err) {
          throw err;
        }
      });

      logger.info('Server running at:', this.server.info.uri);
    }
}

var server = new APIServer();
server.start();
