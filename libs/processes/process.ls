# Convert degress to radians for JavaScript Math
# Point class to save the point information
# Just a data object

require! {
  "./circle": Circle
  "./fixed-point": FixedPoint
  "./spiral": Spiral
  "./spiral-total-water":SpiralTotalWater
}

process-types = {
  circle: Circle
  "fixed-point": FixedPoint
  spiral: Spiral
  "spiral-total-water": SpiralTotalWater
}

create-process = (params) ->
  return new process-types[params.name](params)

module.exports = {
    create-process: create-process
}
