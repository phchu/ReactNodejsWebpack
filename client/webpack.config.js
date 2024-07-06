const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpackBundleAnalyzer = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const { BundleAnalyzerPlugin } = webpackBundleAnalyzer;
const DIST = path.join(__dirname, '..', 'dist', 'public');

const bundleFilename = (pathData) => {
  let { name } = pathData.chunk;
  // name will be undefined for vendors
  if (name === undefined) {
    name = pathData.chunk.id;
    // id is very long by default, I chose to shorten it
    if (name.includes('vendors-')) {
      name = 'vendors';
    }
  }
  return `assets/js/${name}.bundle.js`;
};
module.exports = (env, argv) => {
  const isDEV = argv.mode === 'development';
  const config = {
    name: 'client',
    entry: './index.js',
    output: {
      path: DIST,
      filename: bundleFilename,
      chunkFilename: 'assets/js/[name].bundle.js',
      publicPath: '/',
    },
    node: {
      __dirname: true,
      __filename: true,
      global: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                mimetype: 'application/font-woff',
                name: 'assets/fonts/[hash:8]-[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/fonts/[hash:8]-[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                name: 'assets/images/[hash:8]-[name].[ext]',
              },
            },
            {
              loader: 'image-webpack-loader',
              options: {
                byPassOnDebug: true,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      modules: [path.resolve(__dirname, '..', 'node_modules'), 'node_modules'],
      extensions: [
        '.mjs',
        '.es',
        '.es6',
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.json',
      ],
      fallback: {
        path: false,
        readline: false,
        fs: false,
      },
    },
    devtool: isDEV ? 'inline-source-map' : false,
    devServer: {
      port: 3000,
      compress: true,
      open: true,
      hot: true,
      proxy: [
        {
          context: ['/graphql', '/api'],
          target: 'http://localhost:8080',
        },
      ],
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          'graphql-vendor': {
            test: /[\\/]node_modules[\\/](apollo-cache-inmemory|apollo-client|apollo-link|apollo-link-error|apollo-link-http|graphql|graphql-tag)[\\/]/,
            name: 'graphql-vendor~main',
            chunks: 'all',
            enforce: true,
            priority: 20,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: 10,
          },
          'react-vendor': {
            test: /[\\/]node_modules[\\/](react|react-dom|history|prop-types|react-apollo|react-apollo-hooks|react-fa|react-loadable|react-router-dom)[\\/]/,
            name: 'react-vendor~main',
            chunks: 'all',
            enforce: true,
            priority: 20,
          },
          utility: {
            test: /[\\/]node_modules[\\/](lodash|moment|moment-timezone)[\\/]/,
            name: 'utility-vendor~main',
            chunks: 'all',
            enforce: true,
            priority: 20,
          },
          'antd-vendor': {
            test: (module) => /antd/.test(module.context),
            reuseExistingChunk: false,
            name: 'antd-vendor~main',
            chunks: 'all',
            enforce: true,
            priority: 20,
          },
        },
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            sourceMap: false,
            format: {
              comments: false,
            },
          },
          extractComments: false,
          parallel: true,
        }),
      ],
    },
    plugins: [
      new CleanWebpackPlugin({
        dangerouslyAllowCleanPatternsOutsideProject: true,
        cleanAfterEveryBuildPatterns: [DIST],
      }),
      new HtmlWebpackPlugin({
        template: '../public/index.html',
        favicon: '../public/favicon.ico',
      }),
      new CompressionPlugin(),
      new BundleAnalyzerPlugin(),
    ],
  };
  const configWithTimeMeasures = new SpeedMeasurePlugin().wrap(config);
  configWithTimeMeasures.plugins.push(
    new MiniCssExtractPlugin({
      chunkFilename: 'assets/css/[hash:8]-[name].css',
    })
  );
  return configWithTimeMeasures;
};
