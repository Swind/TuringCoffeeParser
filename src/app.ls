require! {
    "restify": restify 
}

server = restify.createServer();

###############################################################
#
#    Statics API 
#
###############################################################
#
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
server.get  '/cookbooks', list_cookbooks
server.get '/cookbooks/:name', read_cookbook
server.put '/cookbooks/:name', update_cookbook
server.delete '/cookbooks/:name', delete_cookbook

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
