# Convert degress to radians for JavaScript Math
# Point class to save the point information
# Just a data object

require! {
  "./circle": Circle
}

process-types = {
  circle: Circle
}

create-process = (params) ->
  return new process-types[params.name](params)

module.exports = {
    create-process: create-process
}
