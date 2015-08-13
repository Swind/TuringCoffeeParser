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
addVendor = (type, name, path, config) ->
    config.resolve.alias[name] = path
    config.module.noParse.push new RegExp '^' + name + '$'

    if type == \js
        config.entry.vendors.push name

defaultConfig = {
    module:{
        loaders:
          * test: /\.ls$/
            loader: "livescript-loader"
            exclude: /node_modules/
          * test: /\.(png|jpg|gif)$/
            loader: "url-loader?limit=8192"
    }
}

if process.env.NODE_ENV !== \production
    defaultConfig.devtool = \source-map
    defaultConfig.debug = true

config = (overrides) ->
    return deepmerge defaultConfig, overrides || {}

bower_dir = __dirname + "/../bower_components"

frontendConfig = config {
    entry: {
        bundle: "./src/static/ls/coffee.ls"
        vendors: []
    }
    module:{
        noParse: []
    }
    resolve:{
        alias:{
        }
    }
    output: {
        path: "build/static/js"
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
    addVendor \js, \jquery, bower_dir + "/jquery/dist/jquery.min.js", frontendConfig
    addVendor \js, \mithril, bower_dir + "/mithril/mithril.min.js", frontendConfig
    addVendor \js, \materialize, bower_dir + "/materialize/dist/js/materialize.min.js", frontendConfig
    addVendor \js, \holderjs, bower_dir + "/holderjs/holder.min.js", frontendConfig

    console.log frontendConfig

    webpack(frontendConfig).run onBuild done

gulp.task \backend-build, (done)->
    webpack(backendConfig).run onBuild done

gulp.task \webpack, [\frontend-build]
