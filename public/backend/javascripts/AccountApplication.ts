/**
 AccountApplication.js

 Copyright (c) 2015 7ThCode.

 This software is released under the MIT License.

 http://opensource.org/licenses/mit-license.php
*/

///<reference path="../../../../DefinitelyTyped/angularjs/angular.d.ts"/>
///<reference path="../../../lib/lib.d.ts"/>

'use strict';

var app = angular.module('AccountApplication', [ 'ui.router','AccountControllers', 'TopControllers']);

app.config(['$stateProvider', '$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('start', {
            url: '/start',
            templateUrl: 'partials/patient/start.html',
            controller: 'StartController'
        })

        .state('patients', {
            url: '/patients',
            templateUrl: 'partials/patient/patients.html',
            controller: 'PatientsController'
        })

        .state('description', {
            url: '/description',
            templateUrl: 'partials/patient/description.html',
            controller: 'DescriptionController'
        })

        .state('accounts', {
            url: '/accounts',
            templateUrl: 'partials/account/accounts.html',
            controller: 'AccountsController'
        })

        .state('controlles', {
            url: '/controlles',
            templateUrl: 'partials/controll/panel.html',
            controller: 'ControllpanelController'
        })

        .state('error', {
            url: '/error',
            templateUrl: 'partials/error.html',
            controller: 'ErrorController'
        });
    $urlRouterProvider.otherwise('/start');
}]);

app.config(['$mdThemingProvider',function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('orange')
            .warnPalette('red');
    }]);

app.filter('rgb', function() {
    return function(input):string {
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

app.filter('status', function() {
        return function(input):string {
            var result = "";

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

app.filter('message', function() {
        return function(input):string {
            var result = "?????";

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



