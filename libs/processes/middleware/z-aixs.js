function zAixs(points, params){

  if (params.high === undefined) {
    return points;
  }

  const startH = params.high.start;
  const endH = (params.high.end !== undefined)? params.high.end: startH;
  const diffH = endH - startH;

  for(let i = 0; i < points.length; i++){
    points[i].z = startH + (diffH/points.length) * i;
  }

  return points;
}

module.exports = zAixs;
