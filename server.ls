require! {
    "express": express
    "path": path
    "http-proxy": httpProxy
}

proxy = httpProxy.createProxyServer!

app = express!

isProduction = process.env.NODE_ENV === 'production'
port = if isProduction then process.env.PORT else 3000
publicPath = path.resolve __dirname, 'public'

app.use express.static publicPath

if not isProduction
  # We require the bundler inside the if block because
  # it is only needed in a development environment.
  # Later you will see why this is a good idea
  console.log "[dev] Start webpack dev server..."
  bundle = require "./server/bundle.ls"
  bundle!

  # Any requests to localhost:3000/build is proxied
  # to webpack-dev-server
  console.log "[dev] Any requests to 'localhost:3000/build/*' is proxied to 'localhost:8080/build/'"
  app.all "/build/*", (req, res) ->
    proxy.web req, res, {
      target: "http://localhost:8080"
    }

# It is important to catch any errors from the proxy or the
# server will crash. An example of this is connecting to the server
# when webpack is bundling
proxy.on "error", (e) ->
  console.log "Could not connect to proxy, please try again..."

app.listen port, ! ->
  console.log 'Server running on port ' + port
