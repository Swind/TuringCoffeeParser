fs = require("fs")
sm = require("simple-markdown")
parser = sm.defaultBlockParse

fs.readFile \testdata, \utf8, (err, data) ->
    tree = parser data 
    console.log(JSON.stringify(tree, null, 4))
