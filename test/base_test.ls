require! {
    "../src/processes/spiral.js": spiral
    "../src/processes/spiral_total_water.js": spiral_total_water
    "../src/processes/circle.js": circle 
    "../src/processes/fixed_point.js": fixed_point 
    "./testdata.js": testdata
    "assert": assert
}

test = it

<- describe 'Test Processes without syntax error'
do
    <- describe 'Sprial generate points'
    <- test "The spiral.points() should return a points list"
    current_data = {
        temperature_of_hot_water: 80
        temperature_of_cold_water: 40
    }

    points = spiral.handler.points(testdata.spiral, current_data)
    assert.notEqual points.length, 0

do
    <- describe 'Sprial total water generate points'
    <- test "The spiral_total_water.points() should return a points list"
    current_data = {
        temperature_of_hot_water: 80
        temperature_of_cold_water: 40
    }
    points = spiral_total_water.handler.points(testdata.spiral_total_water, current_data)
    assert.notEqual points.length, 0

do
    <- describe 'Circle generate points'
    <- test "The circle.points() should return a points list"
    current_data = {
        temperature_of_hot_water: 80
        temperature_of_cold_water: 40
    }
    points = circle.handler.points(testdata.circle, current_data)
    assert.notEqual points.length, 0

do
    <- describe 'Fixed point generate points'
    <- test "The fixed_point.points() should return a points list"
    current_data = {
        temperature_of_hot_water: 80
        temperature_of_cold_water: 40
    }
    points = fixed_point.handler.points(testdata.fixed_point, current_data)
    assert.notEqual points.length, 0
