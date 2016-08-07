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

  apiSpecs() {
    return [
      this.statusSpec(),
    ];
  }
}

module.exports = RefillAPI;
