require! {
    "restify": restify
    "./cookbooks.js": cookbooks
}

Barista = require("./barista.js").Barista

create_server = (port=3000) ->

    ###############################################################
    #
    #    Global Variables 
    #
    ###############################################################
    barista = new Barista

    # HTTP server
    server = restify.createServer();
    server.use restify.bodyParser { mapParams: false }

    # Websockets server

    # Data manager
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
            console.log "Create new cookbook"
            next(new restify.NotFoundError!)
        else
            res.contentType = \json
            res.send cookbook
            next!

    server.put '/cookbooks/:id', (req, res, next) ->
        # Create
        if req.params.id == \new
           cookbook = cbsmgr.update_cookbook null, req.body
        # Update
        else
            cookbook = cbsmgr.update_cookbook req.params.id, req.body

        res.send 201, cookbook
        next!

    server.del '/cookbooks/:id', (req, res, next) ->
        cbsmgr.delete_cookbook parseInt req.params.id
        res.send 204


    #Barista
    /*
    {
        "state": "Brewing",
        "now cookbook id": 1,
        "now process": "Process title",
        "temperature": 90,
        "is water full": true,
        "total commands": 1000,
        "progress": 834
    }
    */
    server.get '/barista', (req, res, next) ->

    server.get '/barista/heater', (req, res, next) ->
    server.get '/barista/heater/start', (req, res, next) ->
    server.get '/barista/heater/stop', (req, res, next) ->

    server.get '/barista/refill', (req, res, next) ->
    server.post '/barista/refill/start', (req, res, next) ->
    server.post '/barista/refill/stop', (req, res, next) ->

    server.post '/barista/brew/start', (req, res, next) ->
    server.post '/barista/brew/stop', (req, res, next) ->

    /*
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
    server.get /^\/((.*)(\.)(.+))*$/, restify.serveStatic {
      directory: 'static'
      default: 'index.html'
    }

    server.listen port

    return server

module.exports = create_server
