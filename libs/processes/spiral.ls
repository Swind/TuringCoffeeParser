require! {
  "./base": {Point, Process}
}

class Spiral extends Process
  default-params: {
      type: \process
      name: \spiral
      radius: {
          start: 10 #mm
          end: 20 #mm
      }
      high: {
          start: 170 #mm
          end: 165 #mm
      }
      cylinder: 5
      point_interval: 0.1 #mm
      feedrate: 80 #mm/min
      extrudate: 0.2 #ml/mm
  }

  (@params) ->
    # Generate all points when this class created
    # To calculator total water and time 
    @points = @generate-points!

  get-time: ! ->
    @get-length! / @params.feedrate * 60

  get-length: ! ->
    @points.length * @params.point_interval

  get-water: ! ->
    @params.total_water

  generate-points: ! ->

    max_theta = radians(@params.cylinder * 360)
    # a is acceleration
    a = (@params.radius.end - @params.radius.start) / max_theta

    total_theta = 0
    points = []

    while total_theta <= max_theta

        # point interval / (2 * pi * r) = theta for one step
        now_radius = a * total_theta + @params.radius.start
        now_theta = radians((@params.point_interval / (2 * Math.PI * now_radius)) * 360)

        total_theta = total_theta + now_theta

        x = now_radius * Math.cos(total_theta)
        y = now_radius * Math.sin(total_theta)

        # Create the point object to save the information
        points[*] = Point x, y

    # Handler f
    for point in points
      point.f = params.feedrate

    # Handler z
    points = Process.z_axial_handler(@params, points)

    return points

module.exports = Spiral
