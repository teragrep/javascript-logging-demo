// Karma configuration

module.exports = function(config) {
  config.set({

    basePath: '',
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      '*.js'
      //'test-main.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],
    preprocessors: {
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    autoWatch: true,
    plugins: [
        'karma-jasmine', 'karma-firefox-launcher', 'karma-requirejs',
    ],
    browsers: ['FirefoxHeadless'],

//  singleRun: false,
    concurrency: Infinity
  })
}
