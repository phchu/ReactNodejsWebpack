const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DIST = path.join(__dirname, 'dist');

module.exports = {
  name: 'client',
  entry: './src/client/index.js',
  output: {
    path: DIST,
    filename: 'client.bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader'] })
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/images/[hash:8]-[name].[ext]'
            }
          },

          {
            loader: 'image-webpack-loader',
            options: { byPassOnDebug: true }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  },
  devServer: {
    port: 3000,
    open: true,
    disableHostCheck: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  plugins: [
    new CleanWebpackPlugin([DIST]),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
    }),
    new ExtractTextPlugin("assets/css/[hash:8]-[name].css")
  ]
};
