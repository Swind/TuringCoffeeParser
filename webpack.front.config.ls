require! {
    "html-webpack-plugin": HtmlWebpackPlugin
    "webpack": webpack
    "path": path
    "fs": fs
}

/*==========================================================
*
*    Prepare variables 
*
============================================================*/
ROOT_PATH = path.resolve __dirname, ""

bower_dir = path.resolve ROOT_PATH, "bower_components"
node_dir = path.resolve ROOT_PATH, "node_modules"
build_dir = path.resolve ROOT_PATH, "public"

main_js = path.resolve ROOT_PATH, "app/coffee.ls"
index_tmp = path.resolve ROOT_PATH, "app/index.html"

/*==========================================================
*
*    Utils 
*
============================================================*/
addVendor = (type, name, path, config) ->
    config.resolve.alias[name] = path

    config.module.noParse.push new RegExp name

    if type == \js
        config.entry.vendors.push name

/*==========================================================
*
*    Config 
*
============================================================*/
module.exports = {
    entry: {
        webpack-dev-server: "webpack-dev-server/client?http://0.0.0.0:8080"
        only-dev-server: "webpack/hot/only-dev-server"
        bundle: main_js
        vendors: []
    }
    module:{
        noParse: []
        loaders: [
              * test: /\.css$/
                loader: 'style-loader!css-loader'

              * test: /\.scss$/
                loader: 'style!css!sass'

              * test: /\.ls$/
                loaders: ["react-hot", "livescript-loader"]
                exclude: /node_modules/

              * test: /\.json$/
                loader: "json-loader"
        ]
    }
    resolve:{
        alias:{
        }
        extensions: ['', '.ls', '.js', '.json']
    }
    output: {
        path: build_dir
        filename: "[name].js"
    }
    plugins: [
        new HtmlWebpackPlugin {
          template: index_tmp
          inject: true
        }
        new webpack.optimize.CommonsChunkPlugin "vendors", "vendors.js"
        new webpack.HotModuleReplacementPlugin!
    ]
    devtool: \sourcemap
    debug: true
}

#addVendor \js, \lokijs, node_dir + "/lokijs/src/lokijs.js", frontendDevConfig
