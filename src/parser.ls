require! {
    "./processes/spiral.js": spiral 
    "./processes/spiral_total_water.js": spiral_total_water
    "./processes/circle.js": circle 
}

const CONTAINER = "container"
const PROCESS = "process"

const SPIRAL = "spiral"

handle_processes = (data) ->
    for item in data 
        if item.type == CONTAINER 
            # Try to find all process
            handle_processes(item.children)
        else if item.type == PROCESS
            # Find the process handler
            spiral.handler.points(item)
