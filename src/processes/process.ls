# Convert degress to radians for JavaScript Math
radians = (degrees) ->
  return degrees * Math.PI / 180;

# Point class to save the point information
# Just a data object
class Point
    (@x=null, @y=null, @z=null, @e1=null, @e2=null, @f=null) ~>

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

e_axial_handler = (params, points, current_data) ->
    c = current_data.temperature_of_cold_water
    h = current_data.temperature_of_hot_water
    t = params.temperature

    percentage_hot_water = (t - c) / (h - c)
    percentage_cold_water = 1 - percentage_hot_water

    if params.hasOwnProperty \extrudate
        if params.hasOwnProperty \point_interval
            total_water_of_point = params.extrudate * params.point_interval
        else
            total_water_of_point = params.extrudate
    else if params.hasOwnProperty \total_water
        total_water_of_point = params.total_water / points.length

    for point in points
        point.e1 = total_water_of_point * percentage_hot_water
        point.e2 = total_water_of_point * percentage_cold_water

    return points

module.exports = {
    radians: radians
    Point: Point
    z_axial_handler: z_axial_handler
    e_axial_handler: e_axial_handler
}
