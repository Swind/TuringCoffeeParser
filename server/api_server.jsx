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

    register(name, options={}) {
        this.server.register({
          register: require(name),
          options: options
        }, (err)=>{
          if(err){
            logger.error('Failed to load plugin:', err);
          }
          else{
            logger.info('Successed to load plugin:', name);
          }
        });
    }

    route(apis){
      for(let api of apis){
        logger.info(`Registered ${api.method}:${api.path} - "${api.config.notes}" successfully`);
        this.server.route(api);
      }
    }

    add_route({method, path, handler, config}) {
      this.server.route(
        {
          method: method,
          path: path,
          handler: handler,
          config: config,
        }
      );
    }

    start() {
      logger.info("Start the API server ...");

      this.server.start((err)=>{
        if (err) {
          throw err;
        }
        else {
          logger.info('Server running at:', this.server.info.uri);
          logger.info('Swagger at:', this.server.info.uri + '/documentation');
        }
      });

    }
}

module.exports = APIServer 
