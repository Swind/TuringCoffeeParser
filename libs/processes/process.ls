# Convert degress to radians for JavaScript Math
radians = (degrees) ->
  return degrees * Math.PI / 180;

# Point class to save the point information
# Just a data object
class Point
    (@x=null, @y=null, @z=null, @f=null) ~>

z_axial_handler = (params, points) ->

    z_start = params.high.start
    z_end = params.high.end

    z_per_point = (z_end - z_start) / points.length

    index = 0
    for point in points
        point.z = z_start + (z_per_point * index)
        index++

    # Quick move to the z start point
    quick_move = Point(z=z_start, f=1000)
    points.unshift(quick_move)

    return points

module.exports = {
    radians: radians 
    Point: Point
    z_axial_handler: z_axial_handler
}
