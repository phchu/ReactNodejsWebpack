const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpackBundleAnalyzer = require('webpack-bundle-analyzer');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');

const {
  BundleAnalyzerPlugin
} = webpackBundleAnalyzer;
const DIST = path.join(__dirname, '..', 'dist', 'public');
const dateFormat = 'mmddhhMM';
module.exports = (env, argv) => {
  const isDEV = argv.mode === 'development';
  return ({
    name: 'client',
    entry: './index.js',
    output: {
      path: DIST,
      filename: 'assets/js/[name].bundle.js',
      chunkFilename: 'assets/js/[name].chunk.js',
      publicPath: '/'
    },
    node: {
      console: false,
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        })
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
            name: 'assets/fonts/[hash:8]-[name].[ext]'
          }
        }]
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'assets/fonts/[hash:8]-[name].[ext]'
          }
        }]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'assets/images/[hash:8]-[name].[ext]'
          }
        },
        {
          loader: 'image-webpack-loader',
          options: {
            byPassOnDebug: true
          }
        }
        ]
      }
      ]
    },
    resolve: {
      modules: [path.resolve(__dirname, '..', 'node_modules'), 'node_modules'],
      extensions: ['.js', '.json', '.jsx']
    },
    devtool: isDEV ? 'inline-source-map' : false,
    devServer: {
      port: 3000,
      open: true,
      disableHostCheck: true,
      historyApiFallback: true,
      proxy: {
        context: ['/graphql', '/api'],
        target: 'http://localhost:8080'
      }
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: true,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
        }),
      ],
    },
    plugins: [
      new CleanWebpackPlugin({
        dangerouslyAllowCleanPatternsOutsideProject: true,
        cleanAfterEveryBuildPatterns: [DIST]
      }),
      new HtmlWebpackPlugin({
        template: '../public/index.html',
        favicon: '../public/favicon.ico',
      }),
      new ExtractTextPlugin({
        filename: 'assets/css/[hash:8]-[name].css',
        allChunks: true
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
      }),
      new CompressionPlugin(),
      new BundleAnalyzerPlugin()
    ]
  });
};
