/**
 PatientController.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

var controllers:angular.IModule = angular.module('PatientsControllers', ["ngMaterial", "ngResource", 'ngMessages', 'ngMdIcons', 'ngAnimate']);

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

interface IGlobal {
    socket: any;
}

controllers.value('Global', {
        socket: null
    }
);

controllers.value("Views", {
        Data: []
    }
);

controllers.value("CurrentPatient", {
    "Information": {
        "name": "",
        "insurance": ""
    },
    "Status": "",
    "Category": "",
    'Input': {},
    'Sequential': 0
});

function List(resource:any, query:any, success:(value:any) => void):void {

    resource.query({query: encodeURIComponent(JSON.stringify(query))}, (data:any):void => {
        if (data) {
            if (data.code === 0) {
                success(data.value);
            }
        }
    });
}


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

controllers.factory('ViewQuery', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/view/query/:query', {query: '@query'}, {
            query: {method: 'GET'}
        });
    }]);

function PatientsList(resource:any, success:(value:any, headers:any) => void):void {

    var today:Date = new Date();
    today.setHours(23, 59, 59, 99);
    var yesterday:Date = new Date();
    yesterday.setHours(0, 0, 0, 1);
    var query:any = {$and: [{Date: {$lte: today}}, {Date: {$gt: yesterday}}]};

    resource.query({query: encodeURIComponent(JSON.stringify(query))}, (data:any, headers:any):void => {
        if (data != null) {
            if (data.code === 0) {
                success(data.value, headers);
            }
        }
    });
}

controllers.controller('BrowseSController', ["$scope", "$stateParams", "$location", 'Patient', 'PatientQuery', "CurrentPatient", "Global", 'ViewQuery', 'Views',
    ($scope:any, $stateParams:any, $location:any, Patient:any, PatientQuery:any, CurrentPatient:any, Global:IGlobal, ViewQuery:any, Views:any):void => {

        List(ViewQuery, {}, (data:any):void  => {
            PatientsList(PatientQuery, (patients:any):void => {
                $scope.patients = patients;
                Views.Data = data;
            });
        });

        $scope.next = (id:any):void => {
            var resource:any = new Patient();
            resource.$get({id: id}, (data:any):void => {
                if (data != null) {
                    if (data.code === 0) {
                        CurrentPatient.id = id;

                        CurrentPatient.Category = data.value.Category;
                        CurrentPatient.Information = data.value.Information;
                        CurrentPatient.Sequential = data.value.Sequential;

                        $scope.Information = CurrentPatient.Information;
                        $scope.Input = CurrentPatient.Input;
                        $scope.Sequential =  CurrentPatient.Sequential;

                        $location.path('/browse/0');
                    }
                }
            });
        };

        // SocketIO
        if (Global.socket === null) {
            Global.socket = io.connect();
        }

        Global.socket.on('client', (data:any):void => {
            if (data.value === "1") {
                PatientsList(PatientQuery, (data:any):void => {
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

        var depertment = _.filter(Views.Data, (data:any):boolean => {
            return (data.Name === CurrentPatient.Category);
        });

        $scope.contents = depertment[0].Pages[page];

        if ($scope.contents.picture.length > 0) {
            var canvas:fabric.ICanvas = new fabric.Canvas('schema');

            _.map<any,any>($scope.contents.picture, (value:any, key:any):void => {

                canvas.setBackgroundImage("/file/" + value.path, canvas.renderAll.bind(canvas), {
                    backgroundImageOpacity: 1.0,
                    backgroundImageStretch: false
                });

                if ($scope.Input[value.name] === null) {
                    fabric.Image.fromURL("/file/" + value.path, (image:any):void => {
                    });
                }

                var hoge:string = JSON.stringify($scope.Input[value.name]);
                canvas.loadFromJSON(hoge, canvas.renderAll.bind(canvas), (o:any, object:any):void => {
                });
            });

            canvas.on({

                'touch:gesture': (options:any):void => {

                },
                'touch:drag': (options:any):void => {

                },
                'touch:orientation': (options:any):void => {

                },
                'touch:shake': (options:any):void => {

                },
                'touch:longpress': (options:any):void => {

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
                if (value.type === "check") { //checkboxの場合は、値がfalseならば表示しない方針。よって、modelの値がfalseyならばvalueはfalseとする。trueならば、"name-value"コンベンションに従う。
                    var name_and_value = value.name.split("-");//"name-value"コンベンション。
                    var value1 = name_and_value[1];
                    if (!value.model) {
                        value1 = false;
                    }
                    $scope.Input[value.name] = {
                        'name': name_and_value[0],
                        'value': value1,
                        'type': value.type
                    };
                } else {//checkbox以外
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
    ($scope:any, $stateParams:any, CurrentPatient:any, Patient:any, Global:IGlobal):void => {
        $scope.Input = CurrentPatient.Input;
    }]);

controllers.controller('WriteController', ["$scope", "$stateParams", "$location", "CurrentPatient", "Patient", 'Global',
    ($scope, $stateParams:any, $location:any, CurrentPatient:any, Patient:any, Global:IGlobal):void => {
        $scope.Input = CurrentPatient.Input;
        $scope.send = true;
        var patient:any = new Patient();
        patient.Input = CurrentPatient.Input;
        patient.Sequential =  CurrentPatient.Sequential;
        patient.Status = "Accepted";
        patient.$update({id: CurrentPatient.id}, (result:any, headers:any):void => {
            CurrentPatient.Input = {};
            $location.path('/browseS');
            Global.socket.emit('server', {value: "1"});
            $scope.send = false;
        });

    }]);
