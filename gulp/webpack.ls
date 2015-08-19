require! {
    gulp
    "gulp-util": gutil
    "deep-merge": DeepMerge
    "path": path
    "webpack": webpack
    "fs": fs
    "webpack-dev-server": WebpackDevServer 
    "html-webpack-plugin": HtmlWebpackPlugin
}

/*==========================================================
*
*    Global variables 
*
============================================================*/

bower_dir = __dirname + "/../bower_components"

defaultConfig = {
    cache: true
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
    defaultConfig.devtool = '#eval-source-map'
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
        path: "build/static"
        filename: "js/frontend.js"
    }
    plugins: [
     new webpack.optimize.CommonsChunkPlugin "vendors", "js/vendors.js"
     new webpack.ProvidePlugin {
         $: "jquery"
         jQuery: "jquery"
         "window.jQuery": "jquery"
         m: "mithril"
     }
     new HtmlWebpackPlugin {
        title: "Turing Coffee"
        filename: "index.html"
     } 
    ]
}

# JavaScript
addVendor \js, \jquery, bower_dir + "/jquery/dist/jquery.min.js", frontendConfig
addVendor \js, \mithril, bower_dir + "/mithril/mithril.min.js", frontendConfig
addVendor \js, \materialize, bower_dir + "/materialize/dist/js/materialize.min.js", frontendConfig
addVendor \js, \holderjs, bower_dir + "/holderjs/holder.min.js", frontendConfig

#CSS
addVendor \css, \materialize-css, bower_dir + "/materialize/dist/css/materialize.min.css", frontendConfig

gulp.task \frontend-build, (done)->
    webpack(frontendConfig).run onBuild done

gulp.task \frontend-watch, (done)->
    webpack(frontendConfig).watch 100, onBuild!

/*==========================================================
*
*    Backend 
*
============================================================*/
backendConfig = config {
  entry: "./src/server/app.ls"
  target: \node
  output:{
    path: "./build"
    public:Path: "build/"
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

gulp.task \backend-watch, (done)->
    webpack(backendConfig).watch 100, onBuild!

/*==========================================================
*
*    Gulp webpack task 
*
============================================================*/
gulp.task \webpack:build, [\backend-build, \frontend-build]
gulp.task \webpack:watch, [\backend-watch, \frontend-watch]
