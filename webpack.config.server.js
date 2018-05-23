const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const DIST = path.join(__dirname, 'dist');

module.exports = [
    {
        name: 'server',
        entry: './src/server/app.js',
        target: 'node',
        output: {
            path: DIST,
            filename: 'server.bundle.js',
        },
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
        }
    }];
