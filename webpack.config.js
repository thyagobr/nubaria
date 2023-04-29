const path = require('path');

module.exports = {
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
