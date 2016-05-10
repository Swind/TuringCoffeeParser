const Joi = require('joi');
const API = require('./api');

class PrinterAPI extends API {
  constructor(printer) {
    super();
    this.printer = printer;
  }

  statusSpec() {
    return {
      method: 'GET',
      path: '/api/printer',
      config: {
        tags: ['api'],
        description: 'Get the status of the printer',
        notes: 'Get the status of the printer',
      },
      handler: this.status.bind(this),
    };
  }

  status(request, reply) {
    this.successed(reply, 200, 'Get the printer status successfully', this.printer.status);
  }

  homeSpec() {
    return {
      method: 'POST',
      path: '/api/printer/home',
      config: {
        tags: ['api'],
        description: 'Move the head to the home position',
        notes: 'Move the head to the home position',
      },
      handler: this.home.bind(this),
    };
  }

  home(request, reply) {
    this.printer.home();
    this.successed(reply, 200, 'Move the head to the home position successfully');
  }

  jogSpec() {
    return {
      method: 'POST',
      path: '/api/printer/jog',
      config: {
        tags: ['api'],
        description: 'Control the printer to move the head or extrude the water',
        notes: 'Control the printer to move the head or extrude the water',
        validate: {
          payload: {
            x: Joi.number().integer(),
            y: Joi.number().integer(),
            z: Joi.number().integer(),
            f: Joi.number().integer(),
          },
        },
      },
      handler: this.home.bind(this),
    };
  }

  jog(request, reply) {
    this.printer.jog(request.params);
    this.successed(reply, 200, 'Send the jog command to the printer successfully');
  }

  apiSpecs() {
    return [
      this.statusSpec(),
      this.homeSpec(),
      this.jogSpec(),
    ];
  }
}

module.exports = PrinterAPI;
