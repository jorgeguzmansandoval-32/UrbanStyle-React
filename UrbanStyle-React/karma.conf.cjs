module.exports = function (config) {

 config.set({

  frameworks: ["jasmine", "webpack"],

  files: [

   { pattern: "src/test/**/*.spec.jsx", watched: false }

  ],

  preprocessors: {

   "src/test/**/*.spec.jsx": ["webpack"]

  },

  webpack: {

   mode: "development",

   devtool: "inline-source-map",

   resolve: { extensions: [".js", ".jsx"] },

   module: {

    rules: [{

     test: /\.jsx?$/,

     exclude: /node_modules/,

     use: {

      loader: "babel-loader",

      options: {

       babelrc: false,

       configFile: false,

       presets: [

        "@babel/preset-env",

        ["@babel/preset-react", { runtime: "automatic" }]

       ],

       plugins: [["istanbul", {

        include: ["src/components/**/*.jsx"],

        exclude: ["**/*.spec.jsx"]

       }]]

      }

     }

    }]

   }

  },

  plugins: [

   "karma-jasmine", "karma-webpack",

   "karma-chrome-launcher", "karma-coverage",

   "karma-spec-reporter"

  ],

  reporters: ["spec", "coverage"],

  coverageReporter: {

   dir: "coverage",

   reporters: [

    { type: "html", subdir: "html" },

    { type: "text-summary" }

   ]

  },

  browsers: ["ChromeHeadless"],

  singleRun: true

 });

};