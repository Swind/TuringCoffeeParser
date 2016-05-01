'use strict';

const logger = require('../utils/logger');
const Hapi = require('hapi');

class APIServer {
    constructor(address, port) {
        this.address = address;
        this.port =port;
        // HTTP Server
        this.server = new Hapi.Server();
        this.server.connection({address: this.address, port: this.port});
    }


    add_route(method, path, handler) {
      self.server.route(
        {
          method: method,
          path: path,
          handler: handler
        }
      );
    }

    start() {
      logger.info("Start the API server ...");
      
      self.server.start((err)=>{
        if (err) {
          throw err;
        }
      });

      logger.info('Server running at:', self.server.info.uri);
    }

}
