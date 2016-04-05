lipsum = require 'lorem-ipsum'

cookbook = do
  name: "two cups"
  desc: "two cups with filter paper"
  content:
    * name: \預浸
      process:
        * type: \process
          name: "fixed point"
          coordinates: do
            x: 0
            y: 0
          high: do
            start: 170
            end: 170
          total_water: 40
        * type: \process
          name: "spiral total water"
          radius: do
            start: 10
            end: 20
          hight: do
            start: 170
            end: 165
          total_water: 60
          total_time: 30
        * type: \process
          name: "delay"
          total_time: 40
    * name: \充煮
      process:
        * type: \process
          name: "spiral total water"
          radius: do
            start: 10
            end: 20
          hight: do
            start: 170
            end: 165
          total_water: 60
          total_time: 30
        * type: \process
          name: "spiral total water"
          radius: do
            start: 10
            end: 20
          hight: do
            start: 170
            end: 165
          total_water: 60
          total_time: 30

process_list = [
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

create_dummy_cookbook = ->
  cookbook

module.exports = {
  dummy_cb: create_dummy_cookbook
}


