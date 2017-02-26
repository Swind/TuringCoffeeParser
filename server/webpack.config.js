var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

/*==========================================================
*
*    Prepare variables
*
============================================================*/

ROOT_PATH = path.resolve(__dirname);

nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

/*==========================================================
*
*    Configuration
*
============================================================*/
module.exports =
{
  entry: './server.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'backend.js'
  },
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less|sass)$/),
    new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw : true, entryOnly : false})
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  externals: nodeModules,
  devtool: 'sourcemap'
};
