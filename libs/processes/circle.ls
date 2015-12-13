require! {
  "./base": {Point, Process}
}

class Circle extends Process
  default-params: {
    type: \process
    name: \circle

    radius: {
      start: 20 #mm 
    }
    high: {
      start: 170 #mm
      end: 170 #mm
    }
    total_water: 0 #mm

    point_interval: 0.1 #mm
    feedrate: 80 #mm/min
    extrudate: 0.2 #ml/mm
  }

  (@params) ->
    @length = @params.total_water / @params.extrudate
    @point-number = @length / @params.point_interval

  get-time: ! ->
    return @length / @params.feedrate * 60

  get-water: ! ->
    return @params.total_water

  get-length: ! ->
    return @length

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
