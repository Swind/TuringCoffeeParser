require! {
    gulp
    "deep-merge": DeepMerge
    "path": path
    "webpack": webpack
    "fs": fs
}

deepmerge = DeepMerge (target, source, key)->
    if target instanceof Array
       return [].concat target, source

    return source

nodeModules = {}

fs.readdirSync \node_modules
  .filter (x)->
      [\bin].indexOf x === -1
  .forEach (mod)->
      nodeModules[mod] = "commonjs " + mod

/*==========================================================
*
*    Frontend and backend webpack config
*
============================================================*/
defaultConfig = {
    module:{
        loaders:
          * test: /\.ls$/
            loader: "livescript-loader"
            exclude: /node_modules/
          * test: /\.(png|jpg|gif)$/
            loader: "url-loader?limit=8192"
    },
    resolve:{
        root: ["bower_components"]
        extensions: ["", ".js", ".ls"]
    }
}

if process.env.NODE_ENV !== \production
    defaultConfig.devtool = \source-map
    defaultConfig.debug = true

config = (overrides) ->
    return deepmerge defaultConfig, overrides || {}

frontendConfig = config {
    entry: "./src/static/ls/coffee.ls"
    output: {
        path: "build/static/js"
        filename: \frontend.js
    }
}

backendConfig = config {
  entry: "./src/app.ls"
  target: \node
  output:{
    path: \build 
    filename: \backend.js
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
}

/*==========================================================
*
*    Webpack task 
*
============================================================*/
onBuild = (done)->
    return (err, stats) ->
        if err
            console.log \Error, err
        else
            console.log stats.toString!

        if done
            done!

gulp.task \frontend-build, (done)->
    webpack(frontendConfig).run onBuild done

gulp.task \backend-build, (done)->
    webpack(backendConfig).run onBuild done

gulp.task \webpack, [\backend-build, \frontend-build]
