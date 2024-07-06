const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

const DIST = path.join(__dirname, '..', 'dist');

module.exports = (env, argv) => {
  const isDEV = argv.mode === 'development';
  const ENV_FILE = isDEV ? '.dev.env' : '.prod.env';
  return {
    name: 'server',
    entry: './app.js',
    target: 'node',
    output: {
      path: DIST,
      filename: 'server.bundle.js',
    },
    devtool: isDEV ? 'inline-source-map' : false,
    externals: [
      nodeExternals({
        modulesDir: path.resolve(__dirname, '../node_modules'),
      }),
    ],
    watch: true,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new Dotenv({
        path: path.join(__dirname, '..', ENV_FILE),
      }),
      new CleanWebpackPlugin({
        dry: false,
        protectWebpackAssets: false,
        dangerouslyAllowCleanPatternsOutsideProject: true,
        cleanOnceBeforeBuildPatterns: ['server.bundle.js', '*.LICENSE.txt'],
      }),
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
        },
      }),
    ],
  };
};
