function temperature(points, params){

  if (params.temperature === undefined) {
    return points;
  }

  for(let i = 0; i < points.length; i++){
    points[i].t = params.temperature
  }

  return points;
}

module.exports = temperature;
