data = [
        {
            type: \container
            name: "Step 2: 沖煮"
            comment: "從離中心 1 cm 的地方開始使用螺旋注水"
            children: [{
                type: \process
                name: \spiral
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
            }]
        }
]

module.exports = {
    data: data
}
