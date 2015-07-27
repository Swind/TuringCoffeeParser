require! {
    "../src/processes/spiral.js": spiral
    "../src/processes/spiral_total_water.js": spiral_total_water
    "../src/processes/circle.js": circle 
    "assert": assert
    "./testdata.js": testdata
}

test = it

<- describe 'Test Processes without syntax error'
do
    <- describe 'Sprial generate points'
    <- test "The spiral.points() should return a points list"
    points = spiral.handler.points(testdata.spiral)
    assert.notEqual points.length, 0

do
    <- describe 'Sprial total water generate points'
    <- test "The spiral_total_water.points() should return a points list"
    points = spiral_total_water.handler.points(testdata.spiral_total_water)
    assert.notEqual points.length, 0

do
    <- describe 'Circle generate points'
    <- test "The circle.points() should return a points list"
    points = circle.handler.points(testdata.circle)
    assert.notEqual points.length, 0
