var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var Dotenv = require('dotenv-webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var AotPlugin = require('@ngtools/webpack');

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },

  resolve: {
    extensions: ['*', '.ts', '.js']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: [helpers.root('src/main-aot.ts')],
        loaders: ['awesome-typescript-loader', 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file"
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
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
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    new webpack.ContextReplacementPlugin(
         // The (\\|\/) piece accounts for path separators in *nix and Windows
         /angular(\\|\/)core(\\|\/)@angular/,
         helpers.root('./src'), // location of your src
         { }
       ),

    new Dotenv({
      systemvars: true
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),

    new CopyWebpackPlugin([
      {
        context: 'node_modules/bootstrap-sass/assets/fonts/bootstrap',
        from: '**/*',
        to: 'fonts/'
      },
      {
        from: 'src/assets',
        to: 'assets',
      },
      {
        context: './node_modules/crds-styles/assets/svgs/',
        from: '*.svg',
        to: 'assets/svgs'
      }
    ], { ignore: ['mock-data/*'] })
  ]
};