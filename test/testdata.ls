spiral = {
    type: \process
    name: \spiral
    description: "spiral test process"
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
    temperature: 80
}

spiral_total_water = {
    type: \process
    name: "spiral-total-water"
    description: "spiral total water test process"
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
    total_water: 60 #ml
    total_time: 30 #sec
    temperature: 50
}

circle = {
    type: \process
    name: \circle
    description: "circle test process"
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
    temperature: 65 
}

fixed-point = {
    type: \process
    name: "fixed-point"
    description: "fixed point test process"
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
    temperature: 65 
}

module.exports = {
    spiral: spiral 
    spiral_total_water: spiral_total_water
    circle: circle
    fixed-point: fixed-point
}
