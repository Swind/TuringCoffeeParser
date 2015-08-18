require! {
    gulp
    "deep-merge": DeepMerge
    "path": path
    "webpack": webpack
    "fs": fs
}

/*==========================================================
*
*    Global variables 
*
============================================================*/

bower_dir = __dirname + "/../bower_components"

defaultConfig = {
    module:{
        loaders:
          * test: /\.ls$/
            loader: "livescript-loader"
            exclude: /node_modules/

          * test: /\.(png|jpg|gif)$/
            loader: "url-loader?limit=8192"

          * test: /\.css$/
            loader: 'style-loader!css-loader'

          * test: /\.scss$/
            loader: 'style!css!sass'

            # Package fonts 
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff" },
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff2" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=image/svg+xml" }
    }
    resolve: {
        extensions: ['', '.ls', '.js']
    }
}

if process.env.NODE_ENV !== \production
    defaultConfig.devtool = \source-map
    defaultConfig.debug = true

/*==========================================================
*
*    Utils 
*
============================================================*/
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

addVendor = (type, name, path, config) ->
    config.resolve.alias[name] = path
    config.module.noParse.push new RegExp '^' + name + '$'

    if type == \js
        config.entry.vendors.push name

config = (overrides) ->
    return deepmerge defaultConfig, overrides || {}

onBuild = (done)->
    return (err, stats) ->
        if err
            console.log \Error, err
        else
            console.log stats.toString!

        if done
            done!

/*==========================================================
*
*    Frontend 
*
============================================================*/

frontendConfig = config {
    entry: {
        bundle: "./src/static/coffee.ls"
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
        filename: \frontend.js
    }
    plugins: [
     new webpack.optimize.CommonsChunkPlugin "vendors", "vendors.js"
    ]
}

gulp.task \frontend-build, (done)->
    # JavaScript
    addVendor \js, \jquery, bower_dir + "/jquery/dist/jquery.min.js", frontendConfig
    addVendor \js, \mithril, bower_dir + "/mithril/mithril.min.js", frontendConfig
    addVendor \js, \materialize, bower_dir + "/materialize/dist/js/materialize.min.js", frontendConfig
    addVendor \js, \holderjs, bower_dir + "/holderjs/holder.min.js", frontendConfig

    #CSS
    addVendor \css, \materialize-css, bower_dir + "/materialize/dist/css/materialize.min.css", frontendConfig

    webpack(frontendConfig).run onBuild done

/*==========================================================
*
*    Backend 
*
============================================================*/
backendConfig = config {
  entry: "./src/server/app.ls"
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


gulp.task \backend-build, (done)->
    webpack(backendConfig).run onBuild done

/*==========================================================
*
*    Gulp webpack task 
*
============================================================*/
gulp.task \webpack, [\backend-build, \frontend-build]
