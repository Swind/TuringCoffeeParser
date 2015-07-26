require! {
    "./process.js": Process 
}

radians = Process.radians
Point = Process.Point

/*
Parameters Example:

{
    type: \process
    name: \circle
    radius: {
        start: 10 #mm
    }
    high: {
        start: 170 #mm
        end: 165 #mm
    }
    total_water: 40 #ml
    point_interval: 0.1 #mm
    feedrate: 80 #mm/min
    extrudate: 0.2 #ml/mm
}
*/

handler = {}

handler.points = (params) ->

    total_length = params.total_water / params.extrudate
    point_number = total_length / params.point_interval

    circumference = 2 * Math.pi * params.radius.start
    total_length = params.total_water / params.extrudate

    cylinder = total_length / circumference

    av = (2 * Math.Pi * cylinder) / point_number

    # Generate x, y 
    point_list = []
    for index from 0 to points.length
        x = params.radius * Math.cos(av * index + start_angle)
        y = params.radius * Math.sin(av * index + start_angle)

        point_list[*] = Point x, y


    return point_list

module.exports = {
    handler: handler
}
