/**
 * @author: @AngularClass
 */
var path = require('path');

const EVENT = process.env.npm_lifecycle_event || '';
const PHOENIX_SERVER = process.env.MIX_ENV || false;

// Helper functions
var ROOT = path.resolve(__dirname, '..');
var PHOENIX_ROOT = path.resolve(__dirname, '../../../../priv/static/js')

function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

function hasNpmFlag(flag) {
  return EVENT.includes(flag);
}

function isWebpackDevServer() {
  return process.argv[1] && !! (/webpack-dev-server/.exec(process.argv[1]));
}

var root = path.join.bind(PHOENIX_SERVER ? './web/static/js/angular2-webpack-phoenix' + path : path, ROOT);
var phoenix_root = path.join.bind(path, PHOENIX_ROOT)

exports.hasProcessFlag = hasProcessFlag;
exports.hasNpmFlag = hasNpmFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.root = root;
exports.phoenix_root = phoenix_root;
