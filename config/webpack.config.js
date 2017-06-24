/**
 * Created by boyce on 17-6-24.
 */
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const debug = require('debug')('app:bin:dev-webpack')

const APP_ENTRY = path.resolve(__dirname, '../src/index.js')
const OUTPUT_PATH = path.resolve(__dirname, '../dist')
const SRC_PATH = path.resolve(__dirname, '../src')
const PUBLIC_PATH = path.resolve(__dirname, '../public')
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
const __DEV__ = process.env.NODE_ENV === 'dev'
const __PROD__ = process.env.NODE_ENV === 'prod'

const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      SRC_PATH,
      'node_modules'
    ],
    alias: {
      actions: path.resolve(SRC_PATH, 'actions'),
      api: path.resolve(SRC_PATH, 'content'),
      utils: path.resolve(SRC_PATH, 'utils'),
      UI: path.resolve(SRC_PATH, 'UI'),
      image: path.resolve(SRC_PATH, 'image'),
      components: path.resolve(SRC_PATH, 'components'),
      layouts: path.resolve(SRC_PATH, 'layouts'),
      routes: path.resolve(SRC_PATH, 'routes'),
      constants: path.resolve(SRC_PATH, 'constants')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /.*node_modules((?!pinyin).)*$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['transform-runtime'],
              presets: ['es2015', 'react', 'stage-0']
            }
          }
        ]
      },
      {
        test: /\.woff(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[ext]?[hash]'
            }
          }
        ]
      },
      {
        test: /\.woff2(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[ext]?[hash]'
            }
          }
        ]
      },
      {
        test: /\.otf(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 10000,
              name: '[name].[ext]?[hash]'
            }
          }
        ]
      },
      {
        test: /\.ttf(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[ext]?[hash]'
            }
          }
        ]
      },
      {
        test: /\.eot(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 10000,
              name: '[name].[ext]?[hash]'
            }
          }
        ]
      },
      {
        test: /\.svg(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[ext]?[hash]'
            }
          }
        ]
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[name].[ext]?[hash]'
            }
          }
        ]
      }
    ]
  },
  entry: {
    app: __DEV__
      ? [APP_ENTRY].concat(`webpack-hot-middleware/client?path=/__webpack_hmr`)
      : [APP_ENTRY],
    vendor: [
      'react',
      'react-redux',
      'react-router',
      'redux'
    ]
  },
  output: {
    filename: `[name].[hash].js`,
    path: OUTPUT_PATH
  },
  externals: {
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    'react/addons': true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      },
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(SRC_PATH, 'index.html'),
      hash: false,
      favicon: path.resolve(PUBLIC_PATH, 'favicon.jpg'),
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true
    })

  ]
}
const BASE_CSS_LOADER = __DEV__ && {
    loader: 'css-loader',
    options: {
      minimize: true || { /* CSSNano Options */ },
      sourceMap: __DEV__
    }
  }

const POSTCSS_CSS_LOADER = {
  loader: 'postcss-loader',
  options: {
    plugins: (loader) => [
      require('autoprefixer')({
        add: true,
        remove: true,
        browsers: ['last 2 versions']
      }),
      require('cssnano')({
        discardComments: {
          removeAll: true
        },
        discardUnused: false,
        mergeIdents: false,
        reduceIdents: false,
        safe: true,
        sourcemap: true
      })
    ]
  }
}

webpackConfig.module.rules.push({
  test: /\.scss$/,
  // exclude: '',
  use: __DEV__ ? [
      'style-loader',
      BASE_CSS_LOADER,
      POSTCSS_CSS_LOADER,
      {
        loader: 'sass-loader',
        options: {
          sourceMap: __DEV__
        }
      }
    ] : ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', 'sass-loader']
    })
})

webpackConfig.module.rules.push({
  test: /\.less$/,
  // exclude: null,
  use: __DEV__ ? [
      'style-loader',
      BASE_CSS_LOADER,
      {
        loader: 'less-loader',
        options: {
          sourceMap: __DEV__
        }
      }
    ] : ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', 'less-loader']
    })
})

webpackConfig.module.rules.push({
  test: /\.css$/,
  use: __DEV__ ? [
      'style-loader',
      BASE_CSS_LOADER,
      POSTCSS_CSS_LOADER
    ] : ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', 'postcss-loader']
    })
})

if (__DEV__) {
  debug('Enabling plugins for live development (HMR, NoErrors).')
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else if (__PROD__) {
  debug('Enabling plugins for production (OccurenceOrder, Dedupe & UglifyJS).')
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        unused: true,
        dead_code: true
      }
    })
  )
}

module.exports = {
  webpackConfig,
  __DEV__,
  __PROD__,
  OUTPUT_PATH,
  SRC_PATH,
  PUBLIC_PATH
}