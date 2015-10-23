lipsum = require 'lorem-ipsum'

process_list = [
    {
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

    {
      type: \process
      name: "spiral total water"
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

    {
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

    {
      type: \process
      name: \fixed_point
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
]

name = ! ->
  return lipsum {
    count: 8 
    units: \words
  }

desc = ! ->
  return lipsum {
    count: 1
    units: \paragraphs
  }

content = ! ->
  randomInt = (low, high) -> 
    Math.floor(Math.random! * (high - low) + low)

  process_num = randomInt(5, 10)

  result = []
  for i from 0 to process_num
    result[*] = process_list[randomInt 0, process_list.length]

  return result

create_dummy_cookbook = ! ->
  cookbook = {
    id: Math.random().toString(36).substr(2)
    name: name!
    description: desc!
    content: content!
  }

  return cookbook

module.exports = {
  dummy_cb: create_dummy_cookbook
}


