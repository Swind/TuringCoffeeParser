const Heater = require('./models/heater');
const Refill = require('./models/refill');
const Printer = require('./models/printer');

class Barista {
  constructor() {
    this.printer = new Printer();
    this.refill = new Refill();
    this.heater = new Heater();
  }
}

module.exports = Barista;
