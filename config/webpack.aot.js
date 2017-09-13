const path = require('path');
const webpack = require('webpack');
// const webpackMerge = require('webpack-merge');
// const commonConfig = require('./webpack.common');
const AotPlugin = require('@ngtools/webpack').AotPlugin;
const Dotenv = require('dotenv-webpack');
const helpers = require('./helpers');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// console.log(process.env);
// console.log(process.env.CRDS_CMS_CLIENT_ENDPOINT);

module.exports = {
  resolve: {
    extensions: ['.ts', '.js']
  },
  entry: './src/main-aot.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'build.js',
  },
  module: {
    rules: [
      { test: /\.scss$/, loaders: ['raw-loader', 'sass-loader'] },
      { test: /\.css$/, loader: 'raw-loader' },
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.ts$/, loader: '@ngtools/webpack' }
    ]
  },
  plugins: [
    new AotPlugin({
      tsConfigPath: path.resolve(__dirname, '../tsconfig-aot.json'),
      entryModule: path.resolve(__dirname, '../src/app/app.module.ts#AppModule')
    }),
    new Dotenv({
      systemvars: true
    }),
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('./src'), // location of your src
      {}
    ),
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
