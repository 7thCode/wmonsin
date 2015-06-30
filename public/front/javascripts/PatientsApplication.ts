/**
 PatientApplication.js

 Copyright (c) 2015 7ThCode.

 This software is released under the MIT License.

 http://opensource.org/licenses/mit-license.php

 */

///<reference path="../../../../DefinitelyTyped/angularjs/angular.d.ts"/>
///<reference path="../../../lib/lib.d.ts"/>

'use strict';

var app = angular.module('PatientsApplication', ['ui.router', 'PatientsControllers', 'TopControllers']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider):any {
    $stateProvider

        .state('browseS', {
            url: "/browseS",
            templateUrl: "/front/partials/browseS",
            controller: 'BrowseSController'
        })

        .state('browse', {
            url: "/browse/:page",
            templateUrl: "/front/partials/browse",
            controller: 'BrowseController'
        }).

        state('write', {
            url: "/write",
            templateUrl: "/front/partials/write",
            controller: 'WriteController'
        });

    $urlRouterProvider.otherwise('partials/browseS');

}]);

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
      var result = "";

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