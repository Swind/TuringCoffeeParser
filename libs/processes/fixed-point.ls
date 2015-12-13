require! {
  "./base": {Point, Process}
}

class FixedPoint extends Process
  default-params: {
    type: \process
    name: \fixed_point
    coordinates: {
        x: 0 #mm
        y: 0 #mm
    }
    high: {
        start: 170 #mm
        end: 170 #mm
    }

    total_water: 40 #ml
    feedrate: 80 #mm/min
    extrudate: 0.2 #ml/mm
  }

  (@params) ->

  get-time: ! ->
    return (@params.total_water/@params.extrudate) / @params.feedrate * 60

  get-water: ! ->
    return @params.total_water

  get-length: ! ->
    return 0

  get-points: ! ->

      point-number = @params.total_water / @params.extrudate

      x = @params.coordinates.x
      y = @params.coordinates.y
      z = @params.high.start
      points = []

      # Quick move to the start point
      points[*] = Point x, y, z, f=2000

      # Extrudate at the start point
      for index from 1 to point-number + 1
          z = @z-axial point-number, index
          points[*] = Point(z=z, e=@params.extrudate)

      return points

module.exports = FixedPoint
