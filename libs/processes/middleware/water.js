function water(points, params){
  const startH = params.high.start;
  const endH = params.high.end;
  const diffH = endH - startH;

  if (params.total_water === undefined) {
    return points;
  }

  point_water = params.total_water/points.length

  for(let i = 0; i < points.length; i++){
    points[i].e = point_water
  }

  return points;
}

module.exports = water;
