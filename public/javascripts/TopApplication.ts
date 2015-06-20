/**
 TopApplication.js

 Copyright (c) 2015 7ThCode.

 This software is released under the MIT License.

 http://opensource.org/licenses/mit-license.php

 */

///<reference path="../../../DefinitelyTyped/angularjs/angular.d.ts"/>
///<reference path="../../lib/lib.d.ts"/>

var app = angular.module('TopApplication', ['ui.router', 'TopControllers']);

app.config(['$stateProvider', '$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {

    $stateProvider

     .state('start', {
      url: '/',
      templateUrl: 'partials/logo.html',
      controller: 'TopController'
     });

 $urlRouterProvider.otherwise('/');
}]);

app.filter('message', function() {
     return function(input):string {
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