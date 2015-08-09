spiral = {
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
    temperature: 60 # degress C
}

spiral_total_water = {
    type: \process
    name: "spiral total water"
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
    total_water: 60 #ml
    total_time: 30 #sec
    temperature: 60 # degress C
}

circle = {
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
    temperature: 60 # degress C
}

fixed_point = {
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
    temperature: 60 # degress C
}

module.exports = {
    spiral: spiral 
    spiral_total_water: spiral_total_water
    circle: circle
    fixed_point: fixed_point
}
