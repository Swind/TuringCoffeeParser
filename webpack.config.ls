require! {
    "path": path
    "webpack": webpack
    "fs": fs
}

nodeModules = {}

fs.readdirSync \node_modules
  .filter (x)->
      [\bin].indexOf x === -1
  .forEach (mod)->
      nodeModules[mod] = "commonjs " + mod

module.exports = { 
  entry: "./src/app.ls"
  target: \node
  output:{
    path: path.join __dirname, \build 
    filename: "app.js"
  }

  module:{
    loaders:
      * test: /\.ls$/
        loader: "livescript-loader"
      * test: /\.(png|jpg|gif)$/
        loader: "url-loader?limit=8192"
  }

  resolve:{
    root: [path.join(__dirname, "bower_components")]
    extensions: ["", ".js", ".ls"]
  }

  plugins: [
    new webpack.IgnorePlugin /\.(css|less|scss|sass)$/
    new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ),
    new webpack.BannerPlugin('require("source-map-support").install();',
                             { raw: true, entryOnly: false })
  ]

  externals: nodeModules

  devtool: \sourcemap
}
