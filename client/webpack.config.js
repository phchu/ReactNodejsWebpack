const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const webpackBundleAnalyzer = require('webpack-bundle-analyzer');
const nodeObjectHash = require('node-object-hash');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin();
const {
  BundleAnalyzerPlugin
} = webpackBundleAnalyzer;
const DIST = path.join(__dirname, '..', 'dist', 'public');
const dateFormat = 'mmddhhMM';
module.exports = (env, argv) => {
  const isDEV = argv.mode === 'development';
  return (smp.wrap({
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
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          'graphql-vendor': {
            test: /[\\/]node_modules[\\/](apollo-cache-inmemory|apollo-client|apollo-link|apollo-link-error|apollo-link-http|graphql|graphql-tag)[\\/]/
          },
          'react-vendor': {
            test: /[\\/]node_modules[\\/](react|react-dom|history|prop-types|react-apollo|react-apollo-hooks|react-fa|react-loadable|react-router-dom)[\\/]/
          },
          utility: {
            test: /[\\/]node_modules[\\/](lodash|moment|moment-timezone)[\\/]/
          },
          'antd-vendor': {
            test: (module) => (/antd/.test(module.context)),
            priority: 2,
            reuseExistingChunk: false
          }
        }
      },
      minimize: true,
      minimizer: [
        new HardSourceWebpackPlugin({
          configHash: (webpackConfig) => nodeObjectHash({ sort: false }).hash(webpackConfig),
          environmentHash: {
            root: process.cwd(),
            directories: [],
            files: ['package-lock.json', 'yarn.lock'],
          }
        }),
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          parallel: true,
          cache: true,
          sourceMap: false,
        })
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
        inject: true
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
  }));
};
