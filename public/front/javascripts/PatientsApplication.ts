/**
 PatientApplication.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

/// <reference path="../../../typings/tsd.d.ts" />

'use strict';



var app:angular.IModule = angular.module('PatientsApplication', ['ui.router', 'PatientsControllers', 'TopControllers']);
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

app.config(['$stateProvider', '$urlRouterProvider','$compileProvider','$httpProvider', ($stateProvider:any, $urlRouterProvider:any, $compileProvider:any, $httpProvider:any):void => {

    $compileProvider.debugInfoEnabled(false);

    $httpProvider.defaults.headers.common = {'x-requested-with': 'XMLHttpRequest'};

    $stateProvider

        .state('browseS', {
            url: "/browseS",
            templateUrl: "/front/partials/browseS",
            controller: 'BrowseSController'
        })

        .state('browse', {
            url: "/browse/:page",
            templateUrl: function ($stateParams) {
                var page = $stateParams.page;

                return "/front/partials/browse";
                //     return "/front/partials/browse2/page2";
            },
            controller: 'BrowseController'
        })

        .state('write', {
            url: "/write",
            templateUrl: "/front/partials/write",
            controller: 'WriteController'
        });

    $urlRouterProvider.otherwise('partials/browseS');
}]);

app.filter('status', ():(input:string) => string => {
        return (input:string):string => {
            var result:string = "";

            switch (input) {
                case "Init":
                    result = "受付済み";
                    break;
                case "Accepted":
                    result = "問診済み";
                    break;
                case "Done":
                    result = "診療済み";
                    break;
            }
            return result;
        }
    }
);

app.filter('message', ():(input:string) => string => {
        return (input:string):string => {
            var result:string = "";

            switch (input) {
                case "required":
                    result = "必ず入力してください.";
                    break;
                case "maxlength":
                    result = "もう少し短くしてください.";
                    break;

                case "itai":
                    result = "痛い";
                    break;

                case "shibire":
                    result = "痺れ";
                    break;

                case "hare":
                    result = "腫れ";
                    break;

                case "clear":
                    result = "消す";
                    break;
            }

            return result;
        }
    }
);