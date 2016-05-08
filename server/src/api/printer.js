var Joi = require('joi');

class PrinterAPI{
  constructor(barista){
    super();
    this.barista = barista;
  }

  get_status_spec(){
    return {
      method: 'GET',
      path: '/api/printer',
      config: {
        tags:['api'],
        description: 'Get the status of the printer',
        notes: 'List all cookbooks'
      },
      handler: this.get_status.bind(this)
    }
  }

  get_status(){
    this.successed(reply, 200, 'Get the printer status successfully', this.barista.printer);
  }
}
