/**
 PatientController.js

 Copyright (c) 2015 7ThCode.

 This software is released under the MIT License.

 http://opensource.org/licenses/mit-license.php

 */

///<reference path="../../../../DefinitelyTyped/lib.d.ts"/>
///<reference path="../../../../DefinitelyTyped/angularjs/angular.d.ts"/>
///<reference path="../../../../DefinitelyTyped/socket.io/socket.io.d.ts" />
///<reference path="../../../../DefinitelyTyped/fabricjs/fabricjs.d.ts" />
///<reference path="../../../../DefinitelyTyped/lodash/lodash.d.ts" />

'use strict';

var controllers = angular.module('PatientsControllers', ["ngMaterial", "ngResource", 'ngMessages', 'ngMdIcons']);

class Browser {
    public name:string;
    public isIE:boolean;
    public isiPhone:boolean;
    public isiPod:boolean;
    public isiPad:boolean;
    public isiOS:boolean;
    public isAndroid:boolean;
    public isPhone:boolean;
    public isTablet:boolean;
    public verArray:any;
    public ver:number;

    constructor() {

        this.name = window.navigator.userAgent.toLowerCase();

        this.isIE = (this.name.indexOf('msie') >= 0 || this.name.indexOf('trident') >= 0);
        this.isiPhone = this.name.indexOf('iphone') >= 0;
        this.isiPod = this.name.indexOf('ipod') >= 0;
        this.isiPad = this.name.indexOf('ipad') >= 0;
        this.isiOS = (this.isiPhone || this.isiPod || this.isiPad);
        this.isAndroid = this.name.indexOf('android') >= 0;
        this.isPhone = (this.isiOS || this.isAndroid);
        this.isTablet = (this.isiPad || (this.isAndroid && this.name.indexOf('mobile') < 0));

        if (this.isIE) {
            this.verArray = /(msie|rv:?)\s?([0-9]{1,})([\.0-9]{1,})/.exec(this.name);
            if (this.verArray) {
                this.ver = parseInt(this.verArray[2], 10);
            }
        }

        if (this.isiOS) {
            this.verArray = /(os)\s([0-9]{1,})([\_0-9]{1,})/.exec(this.name);
            if (this.verArray) {
                this.ver = parseInt(this.verArray[2], 10);
            }
        }

        if (this.isAndroid) {
            this.verArray = /(android)\s([0-9]{1,})([\.0-9]{1,})/.exec(this.name);
            if (this.verArray) {
                this.ver = parseInt(this.verArray[2], 10);
            }
        }
    }
}

controllers.value('Global', {
        socket: null
    }
);

controllers.value("Views", {
        Data: {}
    }
);

controllers.value("CurrentPatient", {
    "Information": {
        "name": "",
        "insurance": ""
    },
    "Status": "",
    "Category": "",
    'Input': {}
});

// Patient resource
controllers.factory('PatientQuery', ['$resource', function ($resource:any):any {
    return $resource('/patient/query/:query', {query: '@query'}, {
        query: {method: 'GET'}
    });
}]);

controllers.factory('Patient', ['$resource', function ($resource:any):any {
    return $resource('/patient/:id', {}, {
    //    get: {method: 'GET'},
        update: {method: 'PUT'}
    });
}]);

controllers.factory('ViewItem', ['$resource', function ($resource:any):any {
    return $resource('/view', {}, {
   //     get: {method: 'GET'}
    });
}]);

function List(resource:any, query:any, success:any):void {
    var result:any = [];

    var today:Date = new Date();
    today.setHours(23, 59, 59, 99);
    var yesterday:Date = new Date();
    yesterday.setHours(0, 0, 0, 1);
    var query:any = {$and: [{Date: {$lte: today}}, {Date: {$gt: yesterday}}]};

    resource.query({query: encodeURIComponent(JSON.stringify(query))}, function (data, headers) {
        if (data != null) {
            if (data.code == 0) {
                success(data.value, headers);
            }
        }
    });
}

controllers.controller('BrowseSController', ["$scope", "$stateParams", "$location", 'Patient', 'PatientQuery', "CurrentPatient", "Global", 'ViewItem', 'Views',
    function ($scope:any, $stateParams:any, $location:any, Patient:any, PatientQuery:any, CurrentPatient:any, Global:any, ViewItem:any, Views:any):void {

        var resource = new ViewItem();
        resource.$get({}, function (data, headers) {
            if (data != null) {
                if (data.code == 0) {
                    Views.Data = data.value[0].Data;
                }
            }
        });

        List(PatientQuery, {}, function (data, headers) {
            $scope.patients = data;
        });

        $scope.next = function (id) {

            var resource = new Patient();
            resource.$get({id: id}, function (data, headers) {

                if (data != null) {
                    if (data.code == 0) {
                        CurrentPatient.id = id;

                        CurrentPatient.Category = data.value.Category;
                        CurrentPatient.Information = data.value.Information;

                        $scope.Information = CurrentPatient.Information;
                        $scope.Input = CurrentPatient.Input;

                        $location.path('/browse/0');
                    }
                }
            });
        };

        // SocketIO
        if (Global.socket == null) {
            Global.socket = io.connect();
        }

        Global.socket.on('client', function (data):void {
            if (data.value === "1") {
                List(PatientQuery, {}, function (data, headers) {
                    $scope.patients = data;
                });
            }
        });

    }]);

controllers.controller('BrowseController', ["$scope", "$stateParams", "$location", "CurrentPatient", 'Views',
    function ($scope:any, $stateParams:any, $location:any, CurrentPatient:any, Views:any):void {
        $scope.Input = CurrentPatient.Input;

        var page = $stateParams.page;

        var color = "rgba(200, 20, 30, 0.4)";

        $scope.contents = Views.Data[CurrentPatient.Category][page];

        if ($scope.contents.picture != null) {
            var canvas : fabric.ICanvas = new fabric.Canvas('c');

            _.map($scope.contents.picture, function (value:any, key) {

                canvas.setBackgroundImage(value.path, canvas.renderAll.bind(canvas), {
                    backgroundImageOpacity: 1.0,
                    backgroundImageStretch: false
                });

                if ($scope.Input[value.name] == null) {
                    fabric.Image.fromURL(value.path, function (image) {

                    });
                }

                var hoge = JSON.stringify($scope.Input[value.name]);
                canvas.loadFromJSON(hoge, canvas.renderAll.bind(canvas), function (o, object) {
                });
            });

            canvas.on({

                'touch:gesture': function (options) {
                    var a = 1;
                },
                'touch:drag': function (options) {
                    var a = 1;
                },
                'touch:orientation': function (options) {
                    var a = 1;
                },
                'touch:shake': function (options) {
                    var a = 1;
                },
                'touch:longpress': function (options) {
                    var a = 1;
                },
                'mouse:up': function (options) {
                    var radius = 20;

                    var browser = new Browser();// browser_is();
                    if (browser.isTablet) {
                        var circle = new fabric.Circle({
                            radius: radius,
                            fill: color,
                            left: options.e.changedTouches[0].clientX - (radius / 2) - canvas._offset.left,
                            top: options.e.changedTouches[0].clientY - (radius / 2) - canvas._offset.top
                        });
                    }
                    else {
                        var circle = new fabric.Circle({
                            radius: radius,
                            fill: color,
                            left: options.e.layerX - (radius / 2),
                            top: options.e.layerY - (radius / 2)
                        });
                    }
                    canvas.add(circle);
                }
            });
        }

        $scope.clearPicture = function ():any {
            canvas.clear().renderAll();
        };

        $scope.setColor = function (val:any):any {
            color = val;
        };

        $scope.next = function (path:any):any {

            _.map($scope.contents.items, function (value:any, key:any):any {
                $scope.Input[value.name] = {'name': value.name, 'value': value.model, 'type': value.type};
            });

            _.map($scope.contents.picture, function (value:any, key:any):any {
                $scope.Input[value.name] = {'name': value.name, 'value': canvas.toJSON(), 'type': value.type};
            });

            CurrentPatient.Input = $scope.Input;

            $location.path(path);
        };

    }]);

controllers.controller('ConfirmController', ["$scope", "$stateParams", "CurrentPatient", "Patient", 'Global',
    function ($scope:any, $stateParams:any, CurrentPatient:any, Patient:any, Global:any):void {
        $scope.Input = CurrentPatient.Input;
    }]);

controllers.controller('WriteController', ["$scope", "$stateParams", "$location", "CurrentPatient", "Patient", 'Global',
    function ($scope, $stateParams:any, $location:any, CurrentPatient:any, Patient:any, Global:any):void {
        $scope.Input = CurrentPatient.Input;

        $scope.send = true;

        var post = new Patient();
        post.Input = CurrentPatient.Input;
        post.Status = "Accepted";
        post.$update({id: CurrentPatient.id}, function (result, headers) {
            CurrentPatient.Input = {};

            $location.path('/browseS');

            Global.socket.emit('server', {value: "1"});
            $scope.send = false;
        });

    }]);
