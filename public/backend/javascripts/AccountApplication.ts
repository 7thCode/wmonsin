/**
 AccountApplication.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

var app:angular.IModule = angular.module('AccountApplication', ['ui.router', 'AccountControllers', 'TopControllers']);

/*
app.config(['$translateProvider', function($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix: '/assets/i18n/locale-',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('ja');
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useMissingTranslationHandlerLog();
    $translateProvider.useLocalStorage();
}]);
*/

app.run([
    '$rootScope',
    function($rootScope) {
        $rootScope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
           var a = 1;
        });
    }
]);

app.config(['$stateProvider', '$urlRouterProvider','$compileProvider','$httpProvider', ($stateProvider:any, $urlRouterProvider:any, $compileProvider:any, $httpProvider:any):void => {

    $compileProvider.debugInfoEnabled(false);

    $httpProvider.defaults.headers.common = {'x-requested-with': 'XMLHttpRequest'};

    $stateProvider

        .state('start', {
            url: '/start',
            templateUrl: '/backend/partials/patient/start',
            controller: 'StartController'
        })

        .state('patients', {
            url: '/patients',
            templateUrl: '/backend/partials/patient/patients',
            controller: 'PatientsController'
        })

        .state('description', {
            url: '/description',
            templateUrl: function ($stateParams) {
                var id = $stateParams.id;
                return '/backend/partials/patient/description/' + id;
            },
            controller: 'DescriptionController',
            params: {id:null}
        })

        .state('accounts', {
            url: '/accounts',
            templateUrl: '/backend/partials/account/accounts',
            controller: 'AccountsController'
        })

        .state('controlles', {
            url: '/controlles',
            templateUrl: '/backend/partials/controll/panel',
            controller: 'ControllpanelController'
        })

        .state('error', {
            url: '/error',
            templateUrl: '/backend/partials/error',
            controller: 'ErrorController'
        })

        .state('departments', {
            url: '/departments',
            templateUrl: '/backend/partials/edit/departments',
            controller: 'DepartmentsController'
        })

        .state('department', {
            url: '/department',
            templateUrl: '/backend/partials/edit/department',
            controller: 'DepartmentEditController'
        })

        .state('page', {
            url: '/page',
            templateUrl: '/backend/partials/edit/page',
            controller: 'PageEditController'
        });

    $urlRouterProvider.otherwise('/start');
}]);

app.config(['$mdThemingProvider', ($mdThemingProvider:any):void => {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('orange')
        .warnPalette('red');
}]);

app.filter('rgb', ():(input:string) => string  => {
        return (input:string):string  => {
            var result = "fill:#000000";

            switch (input) {
                case "Admin":
                    result = "fill:#abcdff";
                    break;
                case "Editor":
                    result = "fill:#abfdef";
                    break;
                case "Viewer":
                    result = "fill:#fbcdef";
                    break;
            }
            return result;
        }
    }
);

app.filter('status', ():(input:string) => string  => {
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


