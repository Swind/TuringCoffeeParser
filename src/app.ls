require! {
    "restify": restify
    "./cookbooks.js": cookbooks
}

create_server = (port=3000) ->

    ###############################################################
    #
    #    Global Variables 
    #
    ###############################################################

    server = restify.createServer();
    cbsmgr = new cookbooks.CookbookMgr \cookbooks.json

    ###############################################################
    #
    #    Rest API
    #
    ###############################################################

    #Cookbooks CRUD
    server.get '/cookbooks', (req, res, next) ->

        list = cbsmgr.list_cookbooks!

        res.contentType = \json
        res.send list

        next!

    server.get '/cookbooks/:id', (req, res, next) ->
        cookbook = cbsmgr.read_cookbook res.params.id

        if cookbook == null
            next(new restify.NotFoundError!)
        else
            res.contentType = \json
            res.send cookbook
            next!

    server.put '/cookbooks/:id', (req, res, next) ->
        # Create
        if req.params.id == \new
            cookbook = cbsmgr.update_cookbook null, req.params.data
        # Update
        else
            cookbook = cbsmgr.update_cookbook req.params.id, req.params.data

        res.send 201, cookbook
        next!

    server.del '/cookbooks/:id', (req, res, next) ->
        cbsmgr.delete_cookbook req.params.id
        res.send 204


    /*
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
    */

    ###############################################################
    #
    #    Statics API 
    #
    ###############################################################

    server.get /.*/, restify.serveStatic({
      directory: './statics'
      default: 'index.html'
    })

    server.listen port

    return server

module.exports = create_server 
