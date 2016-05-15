const Joi = require('joi');
const API = require('./api');

class HeaterAPI extends API {
  constructor(heater) {
    super();
    this.heater = heater;
  }

  statusSpec() {
    return {
      method: 'GET',
      path: '/api/heater',
      config: {
        tags: ['api'],
        description: 'Get the heater status',
        notes: 'Get the heater status',
      },
      handler: this.status.bind(this),
    };
  }

  status(request, reply) {
    this.successed(reply, 200, 'Get the heater status', this.heater.status);
  }

  setTemperatureSpec() {
    return {
      method: 'POST',
      path: '/api/heater',
      config: {
        tags: ['api'],
        description: 'Set the heater temperature',
        notes: 'Set the heater temperature',
        validate: {
          payload: {
            temperature: Joi.number().integer().required(),
          },
        },
      },
      handler: this.setTemperature.bind(this),
    };
  }

  setTemperature(request, reply) {
    const temperature = request.params.temperature;
    this.heater.setTemperature(temperature);
    this.successed(reply, 200, 'Set the temperature successfully');
  }

  apiSpecs() {
    return [
      this.statusSpec(),
      this.setTemperatureSpec(),
    ];
  }
}

module.exports = HeaterAPI;
