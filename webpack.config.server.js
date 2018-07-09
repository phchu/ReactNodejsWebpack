const path = require('path');
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');

const DIST = path.join(__dirname, 'dist');
const dateFormat = 'mmddhhMM';

module.exports = [
  {
    name: 'server',
    entry: './src/server/app.js',
    target: 'node',
    output: {
      path: DIST,
      filename: 'server.bundle.js',
    },
    devtool: 'source-map',
    externals: [nodeExternals()],
    watch: true,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin([DIST]),
      new UglifyJsPlugin({
        sourceMap: true
      }),
      new WebpackAutoInject({
        PACKAGE_JSON_PATH: './package.json',
        SHORT: 'VER',
        components: {
          AutoIncreaseVersion: true,
          InjectAsComment: true,
          InjectByTag: false
        },
        componentsOptions: {
          AutoIncreaseVersion: {
            runInWatchMode: false // it will increase version with every single build!
          },
          InjectAsComment: {
            tag: 'v{version} (build{date})',
            dateFormat
          }
        }
      })
    ]
  }];
