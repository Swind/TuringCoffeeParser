class PrinterAPI {
  constructor(barista) {
    super();
    this.barista = barista;
  }

  getStatusSpec() {
    return {
      method: 'GET',
      path: '/api/printer',
      config: {
        tags: ['api'],
        description: 'Get the status of the printer',
        notes: 'List all cookbooks',
      },
      handler: this.get_status.bind(this),
    };
  }

  getStatus(request, reply) {
    this.successed(reply, 200, 'Get the printer status successfully', this.barista.printer);
  }
}

module.exports = PrinterAPI;
