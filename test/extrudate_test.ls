require! {
    "../src/processes/spiral.js": spiral
    "../src/processes/spiral_total_water.js": spiral_total_water
    "../src/processes/circle.js": circle
    "../src/processes/fixed_point.js": fixed_point
    "./testdata.js": testdata
    "../node_modules/chai/chai.js": assert
}

test = it

<- describe 'Test extrudate handler'
do
    <- describe 'Test extrudate of sprial'
    <- test 'The e1 and e2 of sprial should be 0.1 ml/mm'

    current_data = {
        temperature_of_hot_water: 80
        temperature_of_cold_water: 40
    }

    points = spiral.handler.points testdata.spiral, current_data

    for point in points
        assert.assert.closeTo point.e1, 0.01, 0.000001
        assert.assert.closeTo point.e2, 0.01, 0.000001

do
    <- describe 'Test extrudate of sprial_total_water'
    <- test 'The e1 and e2 of sprial total water should be 0.01 ml/mm'

    current_data = {
        temperature_of_hot_water: 80
        temperature_of_cold_water: 40
    }

    points = spiral_total_water.handler.points testdata.spiral_total_water, current_data

    for point in points
        assert.assert.closeTo point.e1, 0.006364022, 0.0000000001
        assert.assert.closeTo point.e1, 0.006364022, 0.0000000001

do
    <- describe 'Test extrudate of circle'
    <- test 'The e1 and e2 of circle should be 0.1 ml/mm'

    current_data = {
        temperature_of_hot_water: 80
        temperature_of_cold_water: 40
    }

    points = circle.handler.points testdata.circle, current_data

    for point in points
        assert.assert.closeTo point.e1, 0.01, 0.000001
        assert.assert.closeTo point.e2, 0.01, 0.000001

do
    <- describe 'Test extrudate of fixed point'
    <- test 'The e1 and e2 of fixed point should be 0.1 ml/mm'

    current_data = {
        temperature_of_hot_water: 80
        temperature_of_cold_water: 40
    }

    points = fixed_point.handler.points testdata.fixed_point, current_data

    for point in points
        assert.assert.closeTo point.e1, 0.1, 0.000001
        assert.assert.closeTo point.e2, 0.1, 0.000001
