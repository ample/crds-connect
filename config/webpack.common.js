var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var Dotenv = require('webpack-dotenv-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const PHOENIX_SERVER = process.env.MIX_ENV || false;

module.exports = {
  entry: {
    'polyfills': [helpers.root('./src/polyfills.ts')],
    'vendor': [helpers.root('./src/vendor.ts')],
    'app': [helpers.root('./src/main.ts')]
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [{
        test: /\.ts$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: helpers.root('./tsconfig.json')
            }
          },{
            loader: 'angular2-template-loader'
          }
        ],
        exclude:[/\.(spec|e2e)\.ts$/, 'node_modules']
      }, {
        test: /\.html$/,
        loader: 'html-loader'
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }, {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      }, {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        use: ExtractTextPlugin.extract({fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap'})
      }, {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        use: 'raw-loader'
      }, {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['raw-loader', 'sass-loader']
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    //new Dotenv({
      //systemvars: true,
      //sample: helpers.root('./.env'),
      //path: helpers.root('./.env')

    /*}),*/

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),

    new CopyWebpackPlugin([{
      from: helpers.root('src/assets'),
      to: PHOENIX_SERVER ? '/js/crds-connect/assets' : 'assets'
    }], { ignore: ['*.scss', 'mock-data/*'] }),

    new CopyWebpackPlugin([
      {
        from: helpers.root('./apache_site.conf'),
        to: 'apache_site.conf',
        transform: function (content, path) {
          return content.toString().replace(/\${(.*?)}/g, function(match, p1, offset, string) {          
            return process.env[p1];
          });
        }
      },
      {
        context: 'node_modules/bootstrap-sass/assets/fonts/bootstrap',
        from: '**/*', 
        to: PHOENIX_SERVER ? '/js/crds-connect/fonts/' : 'fonts/'
      },
    ])
  ]
};
