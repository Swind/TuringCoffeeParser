require! {
    "restify": restify 
    "cookbooks": cookbooks
}

###############################################################
#
#    Global Variables 
#
###############################################################

server = restify.createServer();
cbsmgr = cookbooks.CookbookManager \cookbooks.json

###############################################################
#
#    Statics API 
#
###############################################################

server.get /.*/, restify.serveStatic({
  directory: './statics'
  default: 'index.html'
})

###############################################################
#
#    Rest API
#
###############################################################

#Cookbooks CRUD
req, res, next <- server.get '/cookbooks'
do
    list = cbsmgr.list_cookbooks!

    res.contentType = \json
    res.send list

    next!

req, res, next <- server.get '/cookbooks/:id'
do
    cookbook = cbsmgr.read_cookbook res.params.id

    if cookbook == null
        next(new restify.NotFoundError!)
    else
        res.contentType = \json
        res.send cookbook
        next!

req, res, next <- server.put '/cookbooks/:id'
do
    # Create
    if req.params.id == \new
        cookbook = cbsmgr.update_cookbook null, req.params.data
    # Update
    else
        cookbook = cbsmgr.update_cookbook req.params.id, req.params.data

    res.send 201, cookbook
    next!

req, res, next <- server.delete '/cookbooks/:id'
do
    cbsmgr.delete_cookbook req.params.id
    res.send 204

#Barista
server.get '/barista', get_barista_status
server.put '/barista/brew', brew_coffee

#Heater
server.get '/heater', get_heater_status
server.put '/heater', set_heater_temperature

#Refill
server.get '/refill', get_refill_status
server.put '/refill/start', start_refill
server.put '/refill/stop', start_refill

<- server.listen 3900
console.log('%s listening at %s', server.name, server.url);
