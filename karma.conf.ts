'use strict';

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'public/bower_components/hammerjs/hammer.js',
            'public/bower_components/angular/angular.js',
            'public/bower_components/angular-ui-router/release/angular-ui-router.js',
            'public/bower_components/angular-animate/angular-animate.js',
            'public/bower_components/angular-messages/angular-messages.js',
            'public/bower_components/angular-aria/angular-aria.js',
            'public/bower_components/angular-material/angular-material.js',
            'public/bower_components/angular-material-icons/angular-material-icons.js',
            'public/bower_components/angular-resource/angular-resource.js',
            'public/bower_components/angular-socket-io/socket.js',
            'public/bower_components/ng-flow/dist/ng-flow-standalone.js',
            'public/bower_components/lodash/lodash.js',
            'public/bower_components/fabric/dist/fabric.js',
            'public/bower_components/jquery/dist/jquery.js',
            'public/bower_components/canvas2image/canvas2image/canvas2image.js',
            'public/bower_components/svg-morpheus/compile/minified/svg-morpheus.js',

            {pattern: "public/bower_components/angular-socket.io-mock/angular-socket.io-mock.js", included: false},
            'public/bower_components/angular-mocks/angular-mocks.js',

            'public/javascripts/TopApplication.js',
            'public/javascripts/TopControllers.js',
            'public/backend/javascripts/AccountApplication.js',
            'public/backend/javascripts/AccountControllers.js',
            'public/front/javascripts/PatientsApplication.js',
            'public/front/javascripts/PatientsControllers.js',
            'spec/account_application_spec.js',
            'spec/account_controllers_spec.js',
            'spec/patients_application_spec.js',
            'spec/patients_controllers_spec.js',
            'spec/top_application_spec.js',
            'spec/top_controllers_spec.js'
        ],
        exclude: [],
        preprocessors: {},
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeCanary'],
        singleRun: false
    })
};