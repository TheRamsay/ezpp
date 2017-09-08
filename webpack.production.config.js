const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    popup: [
      path.resolve(__dirname, 'src/js/index.js'),
      path.resolve(__dirname, 'src/sass/main.sass'),
    ],
    changelog: path.resolve(__dirname, 'src/js/changelog.js'),
  },

  output: {
    publicPath: '',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  module: {
    loaders: [
      {
        test: /\.js$/, loader: 'babel-loader',
      },
      {
        test: /\.json$/, loader: 'json-loader',
      },
      {
        test: /\.s[ac]ss$/, loader: ExtractTextPlugin.extract('css-loader!sass-loader'),
      },
      {
        test: /\.(png|svg|woff2)$/, loader: 'url-loader',
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),

    new CopyWebpackPlugin([
      {
        context: './src/static/',
        from: '**/*',
        to: '.',
      },
    ]),

    new webpack.DefinePlugin({
      __CHROME__: JSON.stringify(JSON.parse(process.env.BUILD_CHROME || true)),
      __FIREFOX__: JSON.stringify(JSON.parse(process.env.BUILD_FF || false)),
    }),

    new UglifyJsPlugin({
      ie8: false,
      mangle: false,
      output: {
        comments: false,
        beautify: true,
      },
      compress: {
        dead_code: true,
        properties: true,
        evaluate: true,
        booleans: true,
        loops: true,
      },
    }),
  ],

  resolve: {
    extensions: ['.js', '.sass', '.scss'],
  },
};