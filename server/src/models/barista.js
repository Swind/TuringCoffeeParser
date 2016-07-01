const Refill = require('./refill');
const Printer = require('./printer');

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

      return 0;
    });
  }
}

module.exports = Barista;
