require! {
    "../src/processes/spiral.js": spiral
    "../src/processes/spiral_total_water.js": spiral_total_water
    "assert": assert
}

test = it

data = {
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
}


<- describe 'Test Processes without syntax error'
do
    <- describe 'Sprial generate points'
    <- test "The spiral.points() should return a points list"
    points = spiral.handler.points(data)
    assert.notEqual points.length, 0

do
    <- describe 'Sprial total water generate points'
    <- test "The spiral_total_water.points() should return a points list"
    points = spiral_total_water.handler.points(data)
    assert.notEqual points.length, 0

