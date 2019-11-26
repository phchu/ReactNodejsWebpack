const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const DIST = path.join(__dirname, '..', 'dist');
const dateFormat = 'mmddhhMM';
module.exports = (env, argv) => {
  const isDEV = argv.mode === 'development';
  return ({
    name: 'server',
    entry: './app.js',
    target: 'node',
    output: {
      path: DIST,
      filename: 'server.bundle.js',
    },
    devtool: isDEV ? 'inline-source-map' : false,
    externals: [nodeExternals({
      modulesDir: path.resolve(__dirname, '../node_modules'),
    })],
    watch: true,
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }]
    },
    plugins: [
      new Dotenv({
        path: isDEV ? './.dev.env' : './.prod.env'
      }),
      new CleanWebpackPlugin({
        dangerouslyAllowCleanPatternsOutsideProject: true,
        cleanAfterEveryBuildPatterns: [DIST]
      }),
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
        },
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
  });
};
