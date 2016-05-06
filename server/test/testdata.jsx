spiral = {
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

module.exports = {
    spiral: spiral 
}
