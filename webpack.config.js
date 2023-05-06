const path = require('path');

const env = process.env.NODE_ENV || "development"

const development_settings = {
  mode: 'development',
  target: 'web',
  entry: './src/weird.js',
  devtool: 'inline-source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "./dist"
  },
};

const test_settings = {
  mode: 'development',
  target: 'web',
  entry: './tests/index.js',
  devtool: 'inline-source-map',
  output: {
    filename: 'output.js',
    path: path.resolve(__dirname, 'tests'),
    publicPath: "./tests"
  },
};

switch(env) {
  case "test":
    module.exports = test_settings
    break;
  default:
    module.exports = development_settings;
    break;
}