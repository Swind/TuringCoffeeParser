var rucksack = require("rucksack-css");
var webpack = require("webpack");
var path = require("path");
var failPlugin = require("webpack-fail-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.join(__dirname, "./src"),
  entry: {
    "bundle.js": "./index.tsx",
    vendor : [
      "react",
      "react-dom",
      "react-redux",
      "react-router-dom",
      "react-router-redux",
      "grommet"
    ]
  },
  output: {
    path: path.join(__dirname, "./static"),
    filename: "[name]"
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: "file-loader?name=[name].[ext]"
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.(tsx)$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          happyPackMode: true
        }
      },
      {
        test: /\.(svg|ttf|woff2|eot|woff)$/,
        loader: "file?name=fonts/[name].[ext]"
      },
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".json", ".js", ".jsx", ".ts", ".tsx"]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.bundle.js"
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development")
      }
    }),
    // new HtmlWebpackPlugin({template: './index.html'}),
    failPlugin
  ],
  devServer: {
    contentBase: "./static",
    hot: true,
    proxy: {
      "/api/*": "http://localhost:3000/"
    }
  }
};
