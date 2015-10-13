param_types = {
  MM: 1
  ML: 2
  MM-MIN: 3
  ML-MIN: 4
}

class Param
  ! ->
    @__required = false
    @__unit = param_types.MM

  mm: ! ->
    @unit = param_types.MM
    return @

  ml: ! ->
    @unit = param_types.ML
    return @

  ml-min: ! ->
    @unit = param_types.ML-MIN
    return @

  mm-min: ! ->
    @unit = param_types.MM-MIN
    return @

  required: !->
    @__required = true
    return @

  is-required: ! -> return @__required

  get-unit: ! -> return @__unit

class Point
    (@x=null, @y=null, @z=null, @f=null) ~>

class Process
  (@params) ->
    @points = []

  get-points: ->
    @points

  z-axial: (point-number, index) ->
    @params.high.start + ((@params.high.end - @params.high.start) / point-number * index)

  radians: (degrees) ->
    degrees * Math.PI / 180;

module.exports = {
    Point: Point
    Process: Process
    Param: Param
}
