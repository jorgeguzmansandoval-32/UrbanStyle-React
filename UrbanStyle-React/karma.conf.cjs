module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      'src/test/**/*.spec.jsx',
      'src/test/**/*.test.jsx',
      'src/test/**/*.test.js'
    ],

    preprocessors: {
      'src/test/**/*.spec.jsx': ['webpack', 'sourcemap'],
      'src/test/**/*.test.jsx': ['webpack', 'sourcemap'],
      'src/test/**/*.test.js': ['webpack', 'sourcemap']
    },

    browsers: ['Chrome'],
    singleRun: true,
    reporters: ['progress']
  });
};
