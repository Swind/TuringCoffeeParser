const Refill = require('./refill');
const Printer = require('./printer');
const Processes = require('turing-coffee-libs/processes')
const Home = require('turing-coffee-libs/processes/home')
const Wait = require('turing-coffee-libs/processes/wait')
const Point = require('turing-coffee-libs/processes/base').Point

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

      let all_points = Processes.load(cookbook.processes)
      this.printer.send_points(all_points);

      return 0;
    });
  }

  home(){
    let home_obj = Process.createProcess(Home.default());
    this.printer.send_points([home_obj]);

    return 0;
  }

  jog(x, y, z, e, f, t){
    let point = new Point(x, y, f);
    point.z = z;
    point.e = e;
    point.t = t;

    this.printer.send_points([point]);

    return 0;
  }
}

module.exports = Barista;
