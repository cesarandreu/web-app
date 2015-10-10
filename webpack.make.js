// Modules
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

/**
 * Make webpack config
 * @param {Object} options Builder options
 * @param {boolean} options.TEST Generate a test config
 * @param {boolean} options.BUILD Generate a build config
 * @returns {Object} Webpack configuration object
 */
module.exports = function makeWebpackConfig (options) {
  /**
   * Environment type
   * BUILD is for generating minified builds
   * TEST is for generating test builds
   */
  var BUILD = !!options.BUILD
  var TEST = !!options.TEST

  /**
   * Environment values
   */
  var NODE_ENV = process.env.NODE_ENV || 'development'

  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {}

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  if (TEST) {
    config.entry = {}
  } else {
    config.entry = {
      app: './app'
    }
  }

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  if (TEST) {
    config.output = {}
  } else {
    config.output = {
      // Absolute output directory
      path: __dirname + '/public',

      // Output path from the view of the page
      // Uses webpack-dev-server in development
      publicPath: BUILD ? '/' : 'http://localhost:8080/',

      // Filename for entry points
      // Only adds hash in build mode
      filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

      // Filename for non-entry points
      // Only adds hash in build mode
      chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
    }
  }

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (TEST) {
    config.devtool = 'inline-source-map'
  } else if (BUILD) {
    config.devtool = 'source-map'
  } else {
    config.devtool = 'eval'
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    preLoaders: [],
    loaders: [{
      // ASSET LOADER
      // Reference: https://github.com/webpack/file-loader
      // Copy png, jpg, jpeg, gif, svg, woff, ttf, eot files to output
      // Rename the file using the asset hash
      // Pass along the updated reference to your code
      // You can add here any file extension you want to get copied to your output
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      loader: 'file'
    }]
  }

  // ISPARTA LOADER
  // Reference: https://github.com/ColCh/isparta-instrumenter-loader
  // Instrument JS files with Isparta for subsequent code coverage reporting
  // Skips node_modules and files that end with .test.js and .test.jsx
  if (TEST) {
    config.module.preLoaders.push({
      test: /\.js$/,
      exclude: [
        /node_modules/,
        /\.test\.js$/
      ],
      loader: 'isparta-instrumenter'
    })
  }

  // JS LOADER
  // Reference: https://github.com/babel/babel-loader
  // Transpile .js files using babel-loader
  // Compiles ES6 and ES7 into ES5 code
  var jsLoader = {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel',

    query: {
      extra: {},
      plugins: [],
      optional: ['runtime']
    }
  }

  // Add babel-plugin-react-transform when not in build or test mode
  // Reference: https://github.com/gaearon/babel-plugin-react-transform
  if (!BUILD && !TEST) {
    jsLoader.query.plugins.push('react-transform')
    jsLoader.query.extra['react-transform'] = {
      transforms: [{

        // Enable automatic hot reload of react components
        // Reference: https://github.com/gaearon/react-transform-catch-errors
        transform: 'react-transform-hmr',
        imports: ['react'],
        locals: ['module']
      }, {

        // Catch errors inside of react component render function and show a screen
        // Reference: https://github.com/gaearon/react-transform-catch-errors
        transform: 'react-transform-catch-errors',
        imports: ['react', 'redbox-react']
      }]
    }
  }

  // Add jsLoader to the loader list
  config.module.loaders.push(jsLoader)

  // LOCAL CSS LOADER

  // Identifier name for local css modules
  // Reference: https://github.com/webpack/css-loader#local-scope
  // More info: https://github.com/css-modules/css-modules
  const localIdentName = BUILD
    ? '[hash:base64]'
    : '[path][name]---[local]---[hash:base64:5]'

  // Reference: https://github.com/webpack/css-loader
  // Allow loading css through js and getting the className
  var localCssLoader = {
    test: /\.css$/,
    include: __dirname + '/app',
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files in production builds
    loader: ExtractTextPlugin.extract(
      // Reference: https://github.com/webpack/style-loader
      // Use style-loader in development for hot-loading
      'style',

      // Reference: https://github.com/postcss/postcss-loader
      // Postprocess your css with PostCSS plugins
      'css?modules&sourceMap&localIdentName=' + localIdentName + '!postcss'
    )
  }

  // GLOBAL CSS LOADER
  // The same as localCssLoader, but imports are globals
  var globalCssLoader = {
    test: /\.css$/,
    include: __dirname + '/node_modules',
    loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
  }

  // Add localCssLoader and globalCssLoader to the loader list
  config.module.loaders.push(localCssLoader, globalCssLoader)

  /**
   * PostCSS
   * Reference: https://github.com/postcss/autoprefixer-core
   * Add vendor prefixes to your css
   */
  config.postcss = [
    autoprefixer({ browsers: ['last 2 versions'] })
  ]

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin('[name].[hash].css', {
      disable: !BUILD || TEST
    }),

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#defineplugin
    // Replace process.env.NODE_ENV with NODE_ENV in code
    // Can be used to replace other values as well
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    })
  ]

  // Skip rendering index.html in test mode
  if (!TEST) {
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    config.plugins.push(
      new HtmlWebpackPlugin({
        title: 'Web application'
      })
    )
  }

  // Add build specific plugins
  if (BUILD) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // Dedupe modules in the output
      new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin()
    )
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: './public',
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false
    }
  }

  return config
}
