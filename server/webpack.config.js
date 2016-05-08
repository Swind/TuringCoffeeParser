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
  entry: './server.jsx',
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'backend.js'
  },
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less|sass)$/),
    new webpack.BannerPlugin('require("source-map-support").install();', { raw : true, entryOnly : false})
  ],
  loaders: [ 
    {
      test: /\.js?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }
  ],
  resolve: {
    extensions: ['', '.js']
  },
  externals: nodeModules,
  devtool: 'sourcemap'
};
