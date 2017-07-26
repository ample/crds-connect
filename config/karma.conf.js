/**
 * @author: @AngularClass
 */

module.exports = function(config) {
  var testWebpackConfig = require('./webpack.test.js')({env: 'test'});

  var configuration = {

    // base path that will be used to resolve all patterns (e.g. files, exclude)
    basePath: '',


    plugins: [
      require('karma-coverage'),
      require('karma-jasmine'),
      require('karma-phantomjs-launcher'),
      require('karma-chrome-launcher'),
      require('karma-teamcity-reporter'),
      require('karma-remap-istanbul'),
      require('karma-mocha-reporter'),
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
      require('phantomjs-polyfill-includes')
    ],

    /*
     * Frameworks to use
     *
     * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
     */
    frameworks: ['jasmine'],

    // list of files to exclude
    exclude: [ ],

    /*
     * list of files / patterns to load in the browser
     *
     * we are building the test environment in ./spec-bundle.js
     */
    files: [ 
      { pattern: './config/spec-bundle.js', watched: false },
      { pattern: 'https://js.stripe.com/v2/', include: true },
      { pattern: './node_modules/phantomjs-polyfill-includes/includes-polyfill.js', include: true } 
    ],

    /*
     * preprocess matching files before serving them to the browser
     * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
     */
    preprocessors: { './config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap'] },

    // Webpack Config at ./webpack.test.js
    webpack: testWebpackConfig,

    coverageReporter: {
      type: 'in-memory'
    },

    remapCoverageReporter: {
      'text-summary': null,
      json: './coverage/coverage.json',
      html: './coverage/html'
    },

    // Webpack please don't spam the console when running in karma!
    webpackMiddleware: { stats: 'errors-only'},

    /*
     * test results reporter to use
     *
     * possible values: 'dots', 'progress'
     * available reporters: https://npmjs.org/browse/keyword/karma-reporter
     */
    reporters: [ 'mocha' ],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    /*
     * level of logging
     * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
     */
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    /*
     * start these browsers
     * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
     */
    browsers: [
      'PhantomJS'
    ],

    customLaunchers: {
      ChromeTravisCi: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    /*
     * Continuous Integration mode
     * if true, Karma captures browsers, runs the tests and exits
     */
    singleRun: false,

    browserNoActivityTimeout: 60000, //default 10000
    browserDisconnectTimeout: 10000, // default 2000
    browserDisconnectTolerance: 1, // default 0
    captureTimeout: 60000
  };

  if (process.env.TRAVIS){
    configuration.browsers = [
      'ChromeTravisCi',
      'PhantomJS'
    ];

    configuration.autoWatch = false;
    configuration.singleRun = true;
  }

  if(process.env.TEAMCITY_VERSION) {
    configuration.reporters = [ 'teamcity' ];

    configuration.autoWatch = false;
    configuration.singleRun = true;
  }

  config.set(configuration);
};
