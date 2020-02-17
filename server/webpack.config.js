const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const fs = require('fs');
const _ = require('lodash');

// merge dependencies in package.json
const mergeJson = paths => {
  return _.chain(paths)
    .map(
      _path =>
        JSON.parse(fs.readFileSync(path.resolve(_path), 'utf8')).dependencies
    )
    .reduce((result, value) => ({ ...result, ...value }))
    .value();
};
const DIST = path.join(__dirname, '..', 'dist');
const dateFormat = 'mmddhhMM';

// create a directory without exception if exists
const mkdir = dir => {
  try {
    fs.mkdirSync(dir);
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
};

// copy a file to target directory (dest) form source directory (src)
const copy = (src, dest) => {
  const oldFile = fs.createReadStream(src);
  const newFile = fs.createWriteStream(dest);
  oldFile.pipe(newFile);
};

// copy files to target directory (dest) form source directory (src)
const copyDir = (src, dest) => {
  mkdir(dest);
  const files = fs.readdirSync(src);
  for (let i = 0; i < files.length; i += 1) {
    const current = fs.lstatSync(path.join(src, files[i]));
    if (current.isDirectory()) {
      copyDir(path.join(src, files[i]), path.join(dest, files[i]));
    } else if (current.isSymbolicLink()) {
      const symlink = fs.readlinkSync(path.join(src, files[i]));
      fs.symlinkSync(symlink, path.join(dest, files[i]));
    } else {
      copy(path.join(src, files[i]), path.join(dest, files[i]));
    }
  }
};
module.exports = (env, argv) => {
  const isDEV = argv.mode === 'development';
  const packageJson = JSON.stringify(
    {
      dependencies: mergeJson([
        '../client/package.json',
        './package.json',
        '../package.json'
      ])
    },
    null,
    2
  );
  mkdir(DIST);
  fs.writeFileSync(`${DIST}/package.json`, packageJson);
  copyDir('./swaggerDoc', `${DIST}/swaggerDoc`);
  return {
    name: 'server',
    entry: './app.js',
    target: 'node',
    output: {
      path: DIST,
      filename: 'server.bundle.js'
    },
    devtool: isDEV ? 'inline-source-map' : false,
    externals: [
      nodeExternals({
        modulesDir: path.resolve(__dirname, '../node_modules'),
        whitelist: ['jquery', 'webpack/hot/dev-server', /^lodash/]
      })
    ],
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
      new Dotenv({
        path: isDEV ? './.dev.env' : './.prod.env'
      }),
      new CleanWebpackPlugin({
        dangerouslyAllowCleanPatternsOutsideProject: true,
        cleanAfterEveryBuildPatterns: [DIST]
      }),
      new TerserPlugin({
        parallel: true,
        extractComments: {
          condition: /@swagger/i,
          filename: 'server.api.js'
        },
        terserOptions: {
          ecma: 6,
          output: {
            comments: /@swagger/i
          }
        }
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
  };
};
