module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],

    files: [
      'src/test/**/*.spec.jsx',
      'src/test/**/*.spec.js'
    ],

    preprocessors: {
      'src/test/**/*.spec.jsx': ['webpack'],
      'src/test/**/*.spec.js': ['webpack']
    },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: {
        extensions: ['.js', '.jsx','.wasm', '.html']
      },
      module: {
        rules: [
          {
            test: /\.[jt]sx?$/,
            exclude: /node_modules/,
            resolve: { fullySpecified: false },
            use: {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                configFile: false,
                presets: [
                  require.resolve('@babel/preset-env'),
                  [require.resolve('@babel/preset-react'), { runtime: 'automatic' }]
                ],
                plugins: [
                  [require.resolve('babel-plugin-istanbul'), {
                    include: ['**/src/test/**/*.spec.js', '**/src/test/**/*.spec.jsx']
                  }]
                ]
              }
            }
          },
          {
            test: /\.(png|jpe?g|gif|webp|avif|svg)$/i,
            type: 'asset/inline'
          },
          {
            test: /\.css$/i,
            sideEffects: true,
            type: 'asset/source'
          }
        ]
      }
    },
    webpackMiddleware: { stats: 'errors-only' },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' }
      ]
    }
  })
}
