/**
 TopApplication.js

 Copyright (c) 2015 7ThCode.

 This software is released under the MIT License.

 http://opensource.org/licenses/mit-license.php

 */

///<reference path="../../../DefinitelyTyped/lib.d.ts"/>
///<reference path="../../../DefinitelyTyped/angularjs/angular.d.ts"/>
///<reference path="../../../DefinitelyTyped/socket.io/socket.io.d.ts" />
///<reference path="../../../DefinitelyTyped/fabricjs/fabricjs.d.ts" />
///<reference path="../../../DefinitelyTyped/lodash/lodash.d.ts" />

var app:any = angular.module('TopApplication', ['ui.router', 'TopControllers']);
/*
app.config(['$translateProvider', function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'assets/i18n/locale-',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('ja');
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useMissingTranslationHandlerLog();
    $translateProvider.useLocalStorage();
}]);
*/
app.config(['$stateProvider', '$urlRouterProvider','$compileProvider', ($stateProvider:any, $urlRouterProvider:any, $compileProvider:any):void => {

    $compileProvider.debugInfoEnabled(false);
    
    $stateProvider

        .state('start', {
            url: '/',
            templateUrl: 'partials/logo',
            controller: 'TopController'
        });

    $urlRouterProvider.otherwise('/');
}]);

app.filter('message', ():Function => {
        return (input:string):string => {
            var result = "?????";

            switch (input) {
                case "front":
                    result = "問診票";
                    break;
                case "stuff":
                    result = "スタッフ";
                    break;
            }
            return result;
        }
    }
);