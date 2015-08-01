require! {
    "restify": restify 
}

respond = (req, res, next) ->
    res.send("Hello" + req.params.name)

server = restify.createServer();
server.get  '/hello/:name', respond
server.head '/hello/:name', respond

<- server.listen 3900
console.log('%s listening at %s', server.name, server.url);
