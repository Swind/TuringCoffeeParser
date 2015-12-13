class Point
    (@x=null, @y=null, @z=null, @f=null) ~>

class Process
  (@params) ->
    @points = []

  get-points: ! ->
    @points

  get-time: ! ->
    -1

  get-water: ! ->
    -1

  get-length: ! ->
    -1

  z-axial: (point-number, index) ->
    @params.high.start + ((@params.high.end - @params.high.start) / point-number * index)

  radians: (degrees) ->
    degrees * Math.PI / 180;

module.exports = {
    Point: Point
    Process: Process
}
