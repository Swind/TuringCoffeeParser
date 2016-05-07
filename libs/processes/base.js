class Point{
    constructor(x=null, y=null, z=null, f=null, t=null) {
      /*
       * x : x aixs
       * y : y aixs
       * z : z aixs
       * f : feed rate
       * t : temperature
       */

      this.x = x;
      this.y = y;
      this.z = z;
      this.f = f;
      this.t = t;
    }
}

class Process{
  constructor(params){
    this.params = params;
    this.points = [];
  }

  get time(){
    return -1;
  }

  get water(){
    return -1;
  }

  get length(){
    return -1;
  }

  radians(degress){
    return degress * Math.PI / 180;
  }
}

module.exports = {
  Point: Point,
  Process: Process
}

