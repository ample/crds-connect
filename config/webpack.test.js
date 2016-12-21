const helpers = require('./helpers');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var Dotenv = require('dotenv-webpack');
const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = function(options) {
  return {

    devtool: 'inline-source-map',

    resolve: {
      extensions: ['', '.ts', '.js'],
      root: helpers.root('src'),
    },

    module: {

      preLoaders: [
        {
          test: /\.ts$/,
          loader: 'tslint-loader',
          exclude: [helpers.root('node_modules')]
        },
        {
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: [
            // these packages have problems with their sourcemaps
            helpers.root('node_modules/rxjs'),
            helpers.root('node_modules/@angular')
          ]
        }
      ],

      loaders: [
        {
          test: /\.ts$/,
          loaders: ['awesome-typescript-loader', 'angular2-template-loader']
        },
        {
          test: /\.html$/,
          loader: 'html'
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
          loader: 'file?name=assets/[name].[hash].[ext]'
        },
        {
          test: /\.css$/,
          exclude: helpers.root('src', 'app'),
          loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
        },
        {
          test: /\.css$/,
          include: helpers.root('src', 'app'),
          loader: 'raw'
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          loaders: ['raw-loader', 'sass-loader']
        }
      ],

      postLoaders: []
    },

    plugins: [
      new Dotenv({
        systemvars: true
      }),
      new DefinePlugin({
        'ENV': JSON.stringify(ENV)
      }),
    ],

    tslint: {
      emitErrors: false,
      failOnHint: false,
      resourcePath: 'src'
    },

    node: {
      global: 'window',
      process: false,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  };
}
