const API = require('./api');

class RefillAPI extends API {
  constructor(refill) {
    super();
    this.refill = refill;
  }

  statusSpec() {
    return {
      method: 'GET',
      path: '/api/refill',
      config: {
        tags: ['api'],
        description: 'Get the refill status',
        notes: 'Get the refill status',
      },
      handler: this.status.bind(this),
    };
  }

  status(request, reply) {
    this.successed(reply, 200, 'Get the refill status', this.refill.status);
  }

  enableSpec() {
    return {
      method: 'POST',
      path: '/api/refill/enable',
      config: {
        tags: ['api'],
        description: 'Enable the refill',
        notes: 'Enable the refill',
      },
      handler: this.enable.bind(this),
    };
  }

  enable(request, reply) {
    this.refill.start();
    this.successed(reply, 200, 'Enable the refill');
  }

  disableSpec() {
    return {
      method: 'POST',
      path: '/api/refill/disable',
      config: {
        tags: ['api'],
        description: 'Enable the refill',
        notes: 'Enable the refill',
      },
      handler: this.disable.bind(this),
    };
  }

  disable(request, reply) {
    this.refill.stop();
    this.successed(reply, 200, 'Disable the refill');
  }

  apiSpecs() {
    return [
      this.statusSpec(),
      this.enableSpec(),
      this.disableSpec(),
    ];
  }
}

module.exports = RefillAPI;
