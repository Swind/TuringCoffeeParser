require! {
    "./process.js": Process 
}

radians = Process.radians
Point = Process.Point

/*
{
    type: \process
    name: \fixed_point
    coordinates: {
        x: 0 #mm
        y: 0 #mm
    }
    high: {
        start: 170 #mm
        end: 165 #mm
    }
    total_water: 40 #ml
    feedrate: 80 #mm/min
    extrudate: 0.2 #ml/mm
}
*/

handler = {}

handler.points = (params) ->

    point_number = params.total_water / params.extrudate

    x = params.coordinates.x
    y = params.coordinates.y
    point_list = []

    # Quick move to the start point
    point_list[*] = Point x, y, f=2000

    # Extrudate at the start point
    for index from 1 to point_number + 1
        point_list[*] = Point(e=params.extrudate)

    # Change the high when extrudate 
    if params.high.start != params.high.end
        point_list = Process.z_axial_handler(params, point_list)
    else:
        point_list.unshift Point(z=params.high.start, f=2000)

    return point_list 

f_handler = (params, points) ->

    for point in points
        point.f = params.feedrate

    return points

module.exports = {
    handler: handler
}
