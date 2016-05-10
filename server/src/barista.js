const Refill = require('./models/refill');
const Printer = require('./models/printer');

class Barista {
  constructor(printer, cookbookMgr) {
    this.printer = printer;
    this.cookbookMgr = cookbookMgr;
  }

  brew(id) {
    this.cookbookMgr.read(id, (err, cookbook) => {
      if (err) {
        return err;
      }
      const points = cookbook;
    });
  }
}

module.exports = Barista;
