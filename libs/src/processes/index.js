const { createProcess } = require('./process')

var _processes_pipeline = [
]


function load(processes_json){

  // Create process class from process json config
  let process_list = []
  let all_points = []

  processes_json.forEach(function (process){
    var process_obj = createProcess(process);
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
