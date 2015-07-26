/**
 PatientController.js

 Copyright (c) 2015 7ThCode.

 This software is released under the MIT License.

 http://opensource.org/licenses/mit-license.php

 */

///<reference path="../../../../DefinitelyTyped/lib.d.ts"/>
///<reference path="../../../../DefinitelyTyped/angularjs/angular.d.ts"/>
///<reference path="../../../../DefinitelyTyped/angularjs/angular-resource.d.ts"/>
///<reference path="../../../../DefinitelyTyped/socket.io/socket.io.d.ts" />
///<reference path="../../../../DefinitelyTyped/fabricjs/fabricjs.d.ts" />
///<reference path="../../../../DefinitelyTyped/lodash/lodash.d.ts" />

'use strict';

var controllers:angular.IModule = angular.module('PatientsControllers', ["ngMaterial", "ngResource", 'ngMessages', 'ngMdIcons','ngAnimate']);

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
controllers.factory('PatientQuery', ['$resource', ($resource:any):angular.resource.IResource<any> => {
    return $resource('/patient/query/:query', {query: '@query'}, {
        query: {method: 'GET'}
    });
}]);

controllers.factory('Patient', ['$resource', ($resource:any):angular.resource.IResource<any> => {
    return $resource('/patient/:id', {}, {
        update: {method: 'PUT'}
    });
}]);

controllers.factory('ViewItem', ['$resource', ($resource:any):angular.resource.IResource<any> => {
    return $resource('/view', {}, {
        //     get: {method: 'GET'}
    });
}]);

function List(resource:any, query:any, success:(value:any, headers:any) => void):void {
    var result:any[] = [];

    var today:Date = new Date();
    today.setHours(23, 59, 59, 99);
    var yesterday:Date = new Date();
    yesterday.setHours(0, 0, 0, 1);
    var query:any = {$and: [{Date: {$lte: today}}, {Date: {$gt: yesterday}}]};

    resource.query({query: encodeURIComponent(JSON.stringify(query))}, (data:any, headers:any):void => {
        if (data != null) {
            if (data.code == 0) {
                success(data.value, headers);
            }
        }
    });
}

controllers.controller('BrowseSController', ["$scope", "$stateParams", "$location", 'Patient', 'PatientQuery', "CurrentPatient", "Global", 'ViewItem', 'Views',
    ($scope:any, $stateParams:any, $location:any, Patient:any, PatientQuery:any, CurrentPatient:any, Global:any, ViewItem:any, Views:any):void => {

        var resource:any = new ViewItem();
        resource.$get({}, (data:any):void => {
            if (data != null) {
                if (data.code == 0) {
                    List(PatientQuery, {}, (patients:any):void => {
                        $scope.patients = patients;
                        Views.Data = data.value.Data;
                    });
                }
            }
        });

        $scope.next = (id:any):void => {
            var resource:any = new Patient();
            resource.$get({id: id}, (data:any):void => {
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

        Global.socket.on('client', (data:any):void => {
            if (data.value === "1") {
                List(PatientQuery, {}, (data:any):void => {
                    $scope.patients = data;
                });
            }
        });

    }]);

controllers.controller('BrowseController', ["$scope", "$stateParams", "$location", "CurrentPatient", 'Views',
    ($scope:any, $stateParams:any, $location:any, CurrentPatient:any, Views:any):void => {
        $scope.Input = CurrentPatient.Input;

        var page:any = $stateParams.page;
        var color:string = "rgba(200, 20, 30, 0.4)";

        $scope.contents = Views.Data[CurrentPatient.Category][page];

        if ($scope.contents.picture != null) {
            var canvas:fabric.ICanvas = new fabric.Canvas('c');

            _.map<any,any>($scope.contents.picture, (value:any, key:any):void => {

                canvas.setBackgroundImage(value.path, canvas.renderAll.bind(canvas), {
                    backgroundImageOpacity: 1.0,
                    backgroundImageStretch: false
                });

                if ($scope.Input[value.name] == null) {
                    fabric.Image.fromURL(value.path, (image:any):void => {
                    });
                }

                var hoge:string = JSON.stringify($scope.Input[value.name]);
                canvas.loadFromJSON(hoge, canvas.renderAll.bind(canvas), (o:any, object:any):void => {
                });
            });

            canvas.on({

                'touch:gesture': (options:any):void => {
                    var a:number = 1;
                },
                'touch:drag': (options:any):void => {
                    var a:number = 1;
                },
                'touch:orientation': (options:any):void => {
                    var a:number = 1;
                },
                'touch:shake': (options:any):void => {
                    var a:number = 1;
                },
                'touch:longpress': (options:any):void => {
                    var a:number = 1;
                },
                'mouse:up': (options:any):void => {
                    var radius:number = 20;

                    var browser:any = new Browser();// browser_is();
                    if (browser.isTablet) {
                        var circle:any = new fabric.Circle({
                            radius: radius,
                            fill: color,
                            left: options.e.changedTouches[0].clientX - (radius / 2) - canvas._offset.left,
                            top: options.e.changedTouches[0].clientY - (radius / 2) - canvas._offset.top
                        });
                    }
                    else {
                        var circle:any = new fabric.Circle({
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

        $scope.clearPicture = ():any => {
            canvas.clear().renderAll();
        };

        $scope.setColor = (val:any):any => {
            color = val;
        };

        $scope.next = (path:any):any => {

            _.map<any,any>($scope.contents.items, (value:any, key:any):void => {
                if (value.type == "check")
                {
                    var name_and_value = value.name.split("-");
                    $scope.Input[value.name] = {'name': name_and_value[0], 'value': name_and_value[1], 'type': value.type};
                }
                else
                {
                    $scope.Input[value.name] = {'name': value.name, 'value': value.model, 'type': value.type};
                }

            });

            _.map<any,any>($scope.contents.picture, (value:any, key:any):void => {
                $scope.Input[value.name] = {'name': value.name, 'value': canvas.toJSON(), 'type': value.type};
            });

            CurrentPatient.Input = $scope.Input;
            $location.path(path);
        };

    }]);

controllers.controller('ConfirmController', ["$scope", "$stateParams", "CurrentPatient", "Patient", 'Global',
    ($scope:any, $stateParams:any, CurrentPatient:any, Patient:any, Global:any):void => {
        $scope.Input = CurrentPatient.Input;
    }]);

controllers.controller('WriteController', ["$scope", "$stateParams", "$location", "CurrentPatient", "Patient", 'Global',
    ($scope, $stateParams:any, $location:any, CurrentPatient:any, Patient:any, Global:any):void => {
        $scope.Input = CurrentPatient.Input;
        $scope.send = true;
        var post:any = new Patient();
        post.Input = CurrentPatient.Input;
        post.Status = "Accepted";
        post.$update({id: CurrentPatient.id}, (result:any, headers:any):void => {
            CurrentPatient.Input = {};
            $location.path('/browseS');
            Global.socket.emit('server', {value: "1"});
            $scope.send = false;
        });

    }]);
