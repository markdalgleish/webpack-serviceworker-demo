var StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
var ejs = require('ejs');
var fs = require('fs');

var template = ejs.compile(fs.readFileSync(__dirname + '/src/index.ejs', 'utf-8'))

module.exports = {
  entry: {
    main: './src/index.js'
  },

  output: {
    filename: 'index.js',
    path: 'dist',
    publicPath: '/',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        },
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new StaticSiteGeneratorPlugin('main', ['/'], { template: template })
  ]
};
