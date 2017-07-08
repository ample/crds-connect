const helpers = require('./helpers');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var Dotenv = require('dotenv-webpack');
var webpack = require('webpack');
const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = function(options) {
  return {

    devtool: 'inline-source-map',

    resolve: {
      extensions: ['*', '.ts', '.js'],
    },

    module: {

      loaders: [
        {
          test: /\.ts$/,
          loaders: ['awesome-typescript-loader', 'angular2-template-loader']
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
          loader: 'file?name=assets/[name].[hash].[ext]'
        },
        {
          test: /\.css$/,
          exclude: helpers.root('src', 'app'),
          loader: ExtractTextPlugin.extract({fallback: 'style', use: 'css?sourceMap'})
        },
        {
          test: /\.css$/,
          include: helpers.root('src', 'app'),
          loader: 'raw-loader'
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          loaders: ['raw-loader', 'sass-loader']
        }
      ]
    },

    plugins: [
      new Dotenv({
        systemvars: true
      }),

      new webpack.ContextReplacementPlugin(
         // The (\\|\/) piece accounts for path separators in *nix and Windows
         /angular(\\|\/)core(\\|\/)@angular/,
         helpers.root('./src'), // location of your src
         { }
       ),

      new DefinePlugin({
        'ENV': JSON.stringify(ENV)
      }),
    ],

    node: {
      global: true,
      process: false,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  };
}
