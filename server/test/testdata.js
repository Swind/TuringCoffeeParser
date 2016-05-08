var spiral = {
    type: 'process',
    name: 'spiral',
    description: 'spiral test process',
    radius: {
        start: 10, //mm
        end: 20 //mm
    },
    high: {
        start: 170, //mm
        end: 165 //mm
    },
    cylinder: 5,
    point_interval: 0.1, //mm
    feedrate: 80, //mm/min
    extrudate: 0.2, //ml/mm
    temperature: 80
}

var circle = {
  type: 'process',
  name: 'circle',
  radius:{
    start: 20 //mm
  },
  high:{
    start: 170, //mm
    end: 170
  },
  total_water: 0, //mm
  point_interval: 0.1, //mm
  feedrate: 80, //mm
  extrudate: 0.2, //ml/mm
  temperature: 60 //C
}

var fixed_point = {
  type: 'process',
  name: 'fixed_point',
  coordinates: {
      x: 0, //mm
      y: 0 //mm
  },
  high:{
    start: 170, //mm
    end: 170
  },
  total_water: 100, //mm
  point_interval: 0.1, //mm
  feedrate: 80, //mm
  extrudate: 0.2, //ml/mm
  temperature: 60 //C
}

var spiral_total_water = {
  type: 'process',
  name: 'spiral total water',
  radius:{
    start: 10, //mm
    end: 20 //mm
  },
  high:{
    start: 170, //mm
    end: 170
  },
  cylinder: 5,
  point_interval: 0.1, //mm
  total_water: 60, //ml
  total_time: 30, //sec
  temperature: 60 //C
}

module.exports = {
    Spiral: spiral,
    SpiralTotalWater: spiral_total_water,
    FixedPoint: fixed_point,
    Circle: circle
}
