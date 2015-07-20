handler = {}

radians = (degrees) ->
  return degrees * Math.PI / 180;

class Point
    (@x=0, @y=0, @z=0) ~>


handler.points = (params) ->
    max_theta = radians(params.cylinder * 360)
    a = (params.radius.end - params.radius.start) / max_theta

    total_theta = 0
    point_list = []

    while total_theta <= max_theta
        # point interval / (2 * pi * r) = theta
        now_radius = a * total_theta + params.radius.start
        now_theta = radians((params.point_interval / (2 * Math.PI * now_radius)) * 360)

        total_theta = total_theta + now_theta

        x = now_radius * Math.cos(total_theta)
        y = now_radius * Math.sin(total_theta)

        p = Point x, y

        point_list[*] = p

handler.point_z = (params, points) ->

    z_start = params.high.start
    z_end = params.high.end

    z_per_point = (z_end - z_start) / len(points)

    for index in [1 to points.length] for point in points
        point.z = z_start + (z_per_point * index)

    # Quick move to the z start point
    quick_move = Point(z=z_start, f=1000)
    points.insert(0, quick_move)

    return points

def __point_f(self, points):
    f = self.feedrate
    for point in points:
        point.f = f
    return points


module.exports = {
    handler: handler
}
