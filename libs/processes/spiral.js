var Base = require('./base');

class Spiral extends Base.Process{
  constructor(params){
    super(params);

    this.default = {
      type: 'process',
      name: 'spiral',
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
      feedrate: 80, //mm
      extrudate: 0.2, //ml/mm
      temperature: 60 //C
    }

    this.points = this.generate_points();
  }

  get time(){
    return this.length / this.params.feedrate * 60;
  }

  get water(){
    return this.points.length * this.params.extrudate;
  }

  get length(){
    return this.points.length * this.params.point_interval;
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

        x = now_radius * Math.cos(total_theta);
        y = now_radius * Math.sin(total_theta);

        // Create the point object to save the information
        points.push(new Point(x=x, y=y, f=this.params.feedrate));
    }
    return points

  }
}
