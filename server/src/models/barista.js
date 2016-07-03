const Refill = require('./refill');
const Printer = require('./printer');
const Process = require('processes/process')
const Home = require('processes/home')
const Wait = require('processes/wait')
const Point = require('processes/base').Point

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

      let all_points = []
      cookbook.processes.forEach(function (process){
        process_obj = Process.createProcess(process);
        all_points = all_points.concat(process_obj.points())
      });

      printer.send_points(all_points);

      return 0;
    });
  }

  home(){
    let home_obj = Process.createProcess(Home.default());
    printer.set_points([home_obj]);

    return 0;
  }

  jog(x, y, z, e, f, t){
    let point = new Point(x, y, f);
    point.e = e;
    point.f = f;
    point.t = t;

    printer.set_points([point]);

    return 0;
  }
}

module.exports = Barista;
