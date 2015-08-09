require! {
    "./process.js": Process 
}

radians = Process.radians
Point = Process.Point

/*
Parameters Example:

{
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
    temperature: 60 #degress C
}
*/

handler = {}

handler.points = (params, current_data) ->

    max_theta = radians(params.cylinder * 360)
    # a is acceleration
    a = (params.radius.end - params.radius.start) / max_theta

    total_theta = 0
    point_list = []

    while total_theta <= max_theta

        # point interval / (2 * pi * r) = theta for one step
        now_radius = a * total_theta + params.radius.start
        now_theta = radians((params.point_interval / (2 * Math.PI * now_radius)) * 360)

        total_theta = total_theta + now_theta

        x = now_radius * Math.cos(total_theta)
        y = now_radius * Math.sin(total_theta)

        # Create the point object to save the information
        point_list[*] = Point x, y

    # Handler e, f and z
    point_list = f_handler params, point_list
    point_list = Process.z_axial_handler params, point_list
    point_list = Process.e_axial_handler params, point_list, current_data

    return point_list

f_handler = (params, points) ->

    for point in points
        point.f = params.feedrate

    return points

module.exports = {
    handler: handler
}
