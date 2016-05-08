var Base = require('./base');

class SpiralTotalWater extends Base.Process{
  constructor(params){
    super(params);

    this.default = {
      type: 'process',
      name: 'spiral total water',
      radius:{
        start: 10, //mm
        end: 20 //mm
      },
      high:{
        start: 170, //mm
        end: 170
      },
      cylinder: 5,
      point_interval: 0.1, //mm
      total_water: 60, //ml
      total_time: 30, //sec
      temperature: 60 //C
    }

    this.points = this.generate_points();
    this.length = this.point_interval * (this.points.length -1);
  }


  get time(){
    return this.params.total_time;
  }

  get water(){
    return this.params.total_water;
  }

  get length(){
    return this.length;
  }

  get points(){
    return this.points;
  }

  generate_points(){
    let max_theta = this.radians(this.params.cylinder * 360);
    // a is acceleration
    let a = (this.params.radius.end - this.params.radius.start) / max_theta;

    let total_theta = 0;
    let points = [];

    while(total_theta <= max_theta){
      // point interval / (2 * pi * r) = theta for one step
      let now_radius = a * total_theta + this.params.radius.start;
      let now_theta = this.radians((this.params.point_interval / (2 * Math.PI * now_radius)) * 360);

      let total_theta = total_theta + now_theta;

      let x = now_radius * Math.cos(total_theta);
      let y = now_radius * Math.sin(total_theta);

      // Create the point object to save the information
      points.push(new Base.Point(x=x, y=y));
    }

    // f 
    let total_len = this.params.point_interval * (points.length - 1);
    f = (total_len * 60) / this.params.total_time;

    for(point of points){
      point.f = f
    }

    return points
  }
}
