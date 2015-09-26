require! {
  "path": path
  "fs": fs

  "webpack": webpack
  "webpack-dev-server": webpackDevServer
  "./../webpack.front.config": frontendConfig
}

mainPath = path.resolve __dirname, "..", "app", "coffee.ls"

module.exports = ! ->
  # First we fire up webpack an pass in the configuration we created
  bundleStart = null
  compiler = webpack frontendConfig

  # We give notice in the terminal when it starts bundling and set the time it started
  compiler.plugin "compile", ! ->
    console.log "Bundling..."
    bundleStart = Date.now!

  # We also give notice when it is done compiling, including the time it took.
  # Nice to have
  compiler.plugin "done", ! ->
    console.log "Bundled in " + (Date.now! - bundleStart) + "ms!"

  bundler = new webpackDevServer compiler, {
    # We need to tell webpack to serve our bundled application
    # from the build path. When proxying:
    # http://localhost:3000/build -> http://localhost:8080/build
    publicPath: "/build/"

    # Configure hot replacement
    hot: true

    # The rest is terminal configurations
    quite: false
    noInfo: true
    stats: {
      colors: true
    }
  }

  bundler.listen 8080, "localhost", ! ->
    console.log "Bundling project, please wait..."
