require! {
  "webpack": webpack
  "path": path
  "fs": fs
}

/*==========================================================
*
*    Prepare variables 
*
============================================================*/
ROOT_PATH = path.resolve __dirname

nodeModules = {}

fs.readdirSync \node_modules
  .filter (x)->
      [\bin].indexOf x === -1
  .forEach (mod)->
      nodeModules[mod] = "commonjs " + mod

if process.env.NODE_ENV !== \production
  devtool = '#source-map'
  debug = true
else
  devtool = '#eval'
  debug = false

/*==========================================================
*
*    Configuration 
*
============================================================*/
module.exports = {
  entry: {
    app: path.resolve ROOT_PATH, "src/server/app.ls"
  }
  target: \node
  output: {
    path: path.resolve ROOT_PATH, "build"
    filename: "app.js"
  }
  module: {
    loaders:[
      test: /\.ls$/
      loader: "livescript-loader"
      exclude: /node_modules/
    ]
  }
  resolve: {
      extensions: ['', '.ls', '.js']
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
  devtool: devtool
  debug: debug
}
