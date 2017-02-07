var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: PHOENIX_SERVER ? "./priv/static/js/crds-connect" : helpers.root('dist'),
    publicPath: '/',
    publicPath: PHOENIX_SERVER ? '/js/crds-connect/' : '/'
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css')
  ]
});
