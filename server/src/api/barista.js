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

  apiSpecs() {
    return [
      this.brewSpec(),
    ];
  }
}

module.exports = BaristaAPI;
