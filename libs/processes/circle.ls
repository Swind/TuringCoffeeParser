require! {
  "immutable": {Seq}
  "./base": {Point, Process, Param} 
}

/*
Parameters Example:

{
    type: \process
    name: \circle
    radius: {
        start: 10 #mm
    }
    high: {
        start: 170 #mm
        end: 165 #mm
    }

    total_water: 40 #ml
    point_interval: 0.1 #mm
    feedrate: 80 #mm/min
    extrudate: 0.2 #ml/mm
}
*/

class Circle extends Process
  (@params) ->
    @length = @params.total_water / @params.extrudate
    @point-number = @length / @params.point_interval

  fields: {
    basic:{
      radius:{
        start: new Param!.mm!.required!
      }
      total_water: new Param!.ml!.required!
      high: {
        start: new Param!.mm!
        end: new Param!.mm!
      }
    }

    advanced: {
      point_interval: new Param!.mm!
      feedrate: new Param!.mm-min!
      extrudate: new Param!.ml-min!
    }
  }


  get-points: ! ->
    circumference = 2 * Math.pi * @params.radius.start
    cylinder = @length / circumference
    av = (2 * Math.Pi * cylinder) / @point-number

    points = []
    for index from 0 to @point-number
        x = @params.radius * Math.cos(av * index)
        y = @params.radius * Math.sin(av * index)
        z = @z-axial @point-number, index
        f = @params.feedrate

        points[*] = Point x, y, z, f

    return points

module.exports = Circle
