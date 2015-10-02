require! {
    "path": path

    "hapi": hapi 
    "inert": inert
    "vision": vision
    "hapi-swagger": hapiSwagger

    "http-proxy": httpProxy

    "./package": pack
    "./utils/logger": logger
}

###############################################################
#
#    Global variables 
#
###############################################################
GLOBAL.logger = logger

proxy = httpProxy.createProxyServer!

isProduction = process.env.NODE_ENV === 'production'
port = if isProduction then process.env.PORT else 3000
publicPath = path.resolve __dirname, 'public'

###############################################################
#
#    API Server 
#
###############################################################
server = new hapi.Server!
server.connection {port: port}

if not isProduction
  # We require the bundler inside the if block because
  # it is only needed in a development environment.
  # Later you will see why this is a good idea
  logger.debug "Start webpack dev server..."
  bundle = require "./server/bundle.ls"
  bundle!

  # Any requests to localhost:3000/build is proxied
  # to webpack-dev-server
  logger.debug "Any requests to 'localhost:3000/build/*' is proxied to 'localhost:8080/build/'"
  server.route {
    method: \GET
    path: "/build/{file}"
    handler: (request, reply) ->
      proxy.web request.raw.req, request.raw.res, {
        target: "http://localhost:8080"
      }
  }

###############################################################
#
#   Plugins 
#
###############################################################

server.register [
inert
vision
{
  register: hapiSwagger
  options: {
    apiVersion: pack.version
  }
}
], (err) ->
  if err
    logger.error "hapi-swagger load error:", err
  else
    logger.info "hapi-swagger interface loaded"

###############################################################
#
#    Route 
#
###############################################################

cookbooks_api = require "./server/api/cookbooks"
server.route cookbooks_api 

# It is important to catch any errors from the proxy or the
# server will crash. An example of this is connecting to the server
# when webpack is bundling
proxy.on "error", (e) ->
  logger.error "Could not connect to proxy, please try again..."

server.start ! ->
  logger.info 'Server running on port ' + port
