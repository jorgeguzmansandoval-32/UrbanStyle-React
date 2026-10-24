module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    files: [
      { pattern: 'src/test/**/*.spec.jsx', watched: false }
    ],
    preprocessors: {
      'src/test/**/*.spec.jsx': ['webpack']
    },
    webpack: {
      mode: 'development',
      resolve: {
        extensions: ['.js', '.jsx', '.json']
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  ['@babel/preset-react', { runtime: 'automatic' }]
                ]
              }
            }
          }
        ]
      }
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    reporters: ['progress']
  });
};