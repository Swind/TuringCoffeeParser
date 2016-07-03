const Joi = require('joi');
const API = require('./api');

class BaristaAPI extends API {
  constructor(barista) {
    super();
    this.barista = barista;
  }

  brewSpec() {
    return {
      method: 'POST',
      path: '/api/barista/brew',
      config: {
        tags: ['api'],
        description: 'Add cookbook into queue',
        notes: 'Add cookbook into queue',
        validate: {
          payload: {
            id: Joi.string().required(),
          }
        }
      },
      handler: this.brew.bind(this),
    };
  }

  brew(request, reply) {
    const payload = request.payload;
    console.log(payload);
    if (this.barista.brew(payload.id) !== 0) {
    }
    this.successed(reply, 200, 'Brew successful');
  }

  jogSpec() {
    return {
      method: 'POST',
      path: '/api/barista/jog',
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
            e: Joi.number().integer(),
            t: Joi.number().integer(),
          },
        },
      },
      handler: this.jog.bind(this),
    };
  }

  jog(request, reply) {
    const payload = request.payload
    this.barista.jog(payload.x, payload.y, payload.z, payload.e, payload.f, t=payload.t);
    this.successed(reply, 200, 'Send the jog command to the printer successfully');
  }


  apiSpecs() {
    return [
      this.brewSpec(),
      this.jogSpec()
    ];
  }
}

module.exports = BaristaAPI;
