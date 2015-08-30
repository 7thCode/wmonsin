/**
 AccountApplication.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */


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
            templateUrl: '/backend/partials/patient/description',
            controller: 'DescriptionController'
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
        .primaryPalette('indigo')
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

app.filter('message', ():(input:string) => string => {
        return (input:string):string => {
            var result:string = "?????";

            switch (input) {
                case "required":
                    result = "必ず入力してください.";
                    break;
                case "maxlength":
                    result = "もうすこし短くしてください.";
                    break;
                case "notkana":
                    result = "カナで入力してください.";
                    break;
                case "notnumeric":
                    result = "半角数字で入力してください.";
                    break;
                case "less10d":
                    result = "10文字以内にしてください.";
                    break;
                case "accept":
                    result = "受付";
                    break;
                case "patientid":
                    result = "患者ID";
                    break;
                case "kana":
                    result = "カナ";
                    break;
                case "name":
                    result = "名前";
                    break;
                case "cancel":
                    result = "キャンセル";
                    break;
                case "password":
                    result = "パスワード";
                    break;

                case "save":
                    result = "保存";
                    break;

                case "changepass":
                    result = "パスワード変更";
                    break;

                case "stuff":
                    result = "スタッフ";
                    break;
                case "patient":
                    result = "患者";
                    break;

                case "top":
                    result = "トップ";
                    break;

                case "config":
                    result = "コンフィグ";
                    break;

                case "login":
                    result = "ログイン";
                    break;

                case "logout":
                    result = "ログアウト";
                    break;
                case "add" :
                    result = "追加...";
                    break;

                case "opentools" :
                    result = "ツール...";
                    break;
            }
            return result;
        }
    }
);


