var spiral, spiral_total_water, assert, test, data;
spiral = require('../src/processes/spiral.js');
spiral_total_water = require('../src/processes/spiral_total_water.js');
assert = require('assert');
test = it;
data = {
  type: 'process',
  name: 'spiral',
  radius: {
    start: 10,
    end: 20
  },
  high: {
    start: 170,
    end: 165
  },
  cylinder: 5,
  point_interval: 0.1,
  feedrate: 80,
  extrudate: 0.2
};
describe('Test Processes without syntax error', function(){
  describe('Sprial generate points', function(){
    return test("The spiral.points() should return a points list", function(){
      var points;
      points = spiral.handler.points(data);
      return assert.notEqual(points.length, 0);
    });
  });
  return describe('Sprial total water generate points', function(){
    return test("The spiral_total_water.points() should return a points list", function(){
      var points;
      points = spiral_total_water.handler.points(data);
      return assert.notEqual(points.length, 0);
    });
  });
});