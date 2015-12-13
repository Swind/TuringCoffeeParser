require! {
    "../libs/processes/process": Process
    "./testdata": testdata
    "assert": assert
}

test = it

<- describe 'Test Processes without syntax error'
do
    <- describe 'Circle generate points'
    <- test "The circle.points() should return a points list"
    circle = Process.create-process testdata.circle
    points = circle.get-points!

    assert.notEqual points.length, 0
    assert.equal circle.get-water!, testdata.circle.total_water
    assert.equal circle.get-time!, (circle.get-length! / testdata.circle.feedrate * 60)
    assert.equal circle.get-length!, 200

do
    <- describe 'Fixed point generate points'
    <- test "The fixed_point.points() should return a points list"
    fixed = Process.create-process testdata.fixed-point
    points = fixed.get-points!

    assert.notEqual points.length, 0
    assert.equal fixed.get-water!, 40
    assert.equal fixed.get-time!, 150
    assert.equal fixed.get-length!, 0

do
    <- describe 'Sprial generate points'
    <- test "The spiral.points() should return a points list"
    spiral = Process.create-process testdata.spiral
    points = spiral.get-points!

    assert.notEqual points.length, 0

do
    <- describe 'Sprial total water generate points'
    <- test "The spiral_total_water.points() should return a points list"
    spiral-total-water = Process.create-process testdata.spiral_total_water
    points = spiral-total-water.get-points!

    assert.notEqual points.length, 0
