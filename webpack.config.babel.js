var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const ENV = process.env.NODE_ENV || 'development';
const sourcePath = path.join(__dirname, './');

var _module = {
  rules: [
    {
      test: /\.(html)/,
      use: [
        //
        {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
        }, {
            loader: "extract-loader"
        }, {
            loader: "html-loader",
            options: {
              attrs: ['img:src', 'link:href', 'script:src']
            }
        }
      ]
    },
    {
      test: /\.(ico|jpg|jpeg|png|gif|svg)/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'images/[hash].[name].[ext]'
          }
        },
        {
          loader: 'image-webpack-loader',
          options: {
            bypassOnDebug: true,
            // optimizationLevel: 7,

            optipng: {
              optimizationLevel: 7
            },
            gifsicle: {
              interlaced: false,
            }
          }
        }
      ]

    }, {
      test: /\.(eot|ttf|woff)/,
      loader: 'file-loader',
      options: {
        name: 'fonts/[hash].[name].[ext]'
      }
    }, {
      test: /\.(css)$/,
        use: [{
            loader: "file-loader",
            options: {
              name: 'css/[hash].[name].[ext]'
            }
        },
        {
            loader: "extract-loader",
        },
        {
            loader: "css-loader",
        }]
    }, {
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      use: [
      {
        loader: "file-loader",
        options: {
          name: 'js/[hash].[name].[ext]'
        }
      },
      {
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'babel-preset-stage-3']
        }
      }],

    }
  ],

};

var resolve = {
  extensions: [
    '*', '.js', '.json'
  ],
  modules: [
    path.resolve(__dirname, './node_modules'), 'node_modules'
  ],
  alias: {
    'base': path.resolve(__dirname, './src/'),
    'assets': path.resolve(__dirname, './src/assets/'),
    'build': path.resolve(__dirname, './build')
  }
};

var plugins = ([
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.LoaderOptionsPlugin({
    debug: ENV,
    options: {
      context: __dirname
    }
  }),
  new ExtractTextPlugin({
    filename: 'style.css',
    disable: false,
    allChunks: true
  })
]);

// ===============

module.exports = function (env) {
  const nodeEnv = env && env.prod ? 'production' : 'development';
  const isProd = ENV === 'production';

  const envars = {

  };

  const plugins = [
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: 'style.css',
      disable: false,
      allChunks: true
    }),
    new webpack.EnvironmentPlugin(envars),
    new webpack.DefinePlugin({
      'process.env': envars
    }),
    new webpack.NamedModulesPlugin()
  ];

  if (isProd) {
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true
        },
        output: {
          comments: false
        }
      }),
      new CopyWebpackPlugin([
        {
          from: 'lib-pdf/**/*'
        }
      ]
      )
    );
  } else {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.LoaderOptionsPlugin({
        debug: true,
        options: {
          context: __dirname
        }
      }),
    );
  }

  const devtool = isProd ? 'source-map' : 'eval';

  return [
    {
      devtool: devtool,
      context: sourcePath,
      name: "browser",
      entry: {
        app: [
          'babel-polyfill',
          './src/home.html',
          './src/calendar.html',
          './src/detail-procedure.html',
          './src/document.html',
          './src/feedback.html',
          './src/find-procedure.html',
          './src/find-procedure-detail.html',
          './src/rating-detail.html',
          './src/rating-list.html',
          './src/search-detail.html',
          './src/search-file.html',
        ],
      },
      output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/'
      },
      module: _module,
      plugins: plugins.concat(
        // new HtmlWebpackPlugin({
        //   template: path.resolve('./src/', 'index.html'),
        //   // favicon: path.resolve('./src/', 'assets/images/favicon.ico'),
        //   minify: {
        //     collapseWhitespace: true
        //   }
        // })
      ),
      performance: isProd && {
        //maxAssetSize: 100,
        //maxEntrypointSize: 300,
        hints: 'warning'
      },
      stats: {
        colors: {
          green: '\u001b[32m'
        }
      },
      node: {
        fs: 'empty',
        child_process: 'empty',
        global: true,
        process: true,
        Buffer: true,
        __filename: true,
        __dirname: true,
        setImmediate: false
      },
      resolve: resolve,
      devServer: {
        host: '0.0.0.0',
        port: process.env.PORT || 3000,
        contentBase: './',
        historyApiFallback: true
      }
    },
    // {
    //   devtool: devtool,
    //   context: sourcePath,
    //   name: "server-side rendering",
    //   entry: {
    //     app: [
    //       'babel-polyfill',
    //       './src/assets/styles/main.css',
    //       './src/server.js'
    //     ],
    //   },
    //   target: "node",
    //   output: {
    //     path: path.join(__dirname, 'build'),
    //     filename: 'bundle.server.js',
    //     publicPath: '/',
    //     libraryTarget: "commonjs2"
    //   },
    //   module: _module,
    //   plugins: plugins,
    //   performance: isProd && {
    //     //maxAssetSize: 100,
    //     //maxEntrypointSize: 300,
    //     hints: 'warning'
    //   },
    //   stats: {
    //     colors: {
    //       green: '\u001b[32m'
    //     }
    //   },
    //   resolve: resolve
    //   //devtool: ENV === 'production' ? 'source-map' : 'source-map'
    // }
  ];
}
