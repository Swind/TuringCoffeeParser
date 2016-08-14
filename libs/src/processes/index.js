const Circle = require('./circle');
const FixedPoint = require('./fixed-point');
const Spiral = require('./spiral');
const SpiralTotalWater = require('./spiral-total-water');
const Wait = require('./wait');
const Home = require('./home');
const Move = require('./move');
const Calibration = require('./calibration');

var _processes = {
  "circle": Circle,
  "fixed_point": FixedPoint,
  "spiral": Spiral,
  "spiral total water": SpiralTotalWater,
  "wait": Wait,
  "home": Home,
  "move": Move,
  "calibration": Calibration,
}

var _processes_pipeline = [
]


function createProcess(params){
    return new _processes[params.name](params);
}

function load(processes_json){

  // Create process class from process json config
  let process_list = []
  let all_points = []

  processes_json.forEach(function (process){
    process_obj = createProcess(process);
    process_list = process_list.concat(process_obj);
  });

  // Let pipeline to handle all processes
  _processes_pipeline.forEach(function(pipeline){
    process_list = pipeline(process_list);
  });

  process_list.forEach(function (process){
    all_points = all_points.concat(process.points);
  });

  return all_points
}

module.exports = {
  load
}
