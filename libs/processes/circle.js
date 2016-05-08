var Base = require('./base');

class Circle extends Base.Process{
  constructor(params){
    super(params);

    this.length = params.total_water / params.extrudate;
    this.point_number = this.length / this.params.point_interval;

    this.defult = {
      type: 'process',
      name: 'circle',
      radius:{
        start: 20 //mm
      },
      high:{
        start: 170, //mm
        end: 170
      },
      total_water: 0, //mm
      point_interval: 0.1, //mm
      feedrate: 80, //mm
      extrudate: 0.2, //ml/mm
      temperature: 60 //C
    }
  }

  get time(){
    return this.length / this.params.feedrate * 60;
  }

  get water(){
    return this.params.total_water;
  }

  get length(){
    return this.length;
  }

  get points(){
    let circumference = 2 * Math.pi * this.params.radius.start;
    let cylinder = this.length / circumference;
    let av = (2 * Math.Pi * cylinder) / this.point_number;

    let high = this.params.high.start;
    let diff = this.params.high.end - this.params.high.start;

    let points = [];

    for(let index = 0; index < this.point_number; index++){
        x = this.params.radius * Math.cos(av * index);
        y = this.params.radius * Math.sin(av * index);
        f = this.params.feedrate;

        let point = new Point(x=x, y=y, f=f);

        points.push(point);
    }

    return points
  }
}

module.exports = Circle
