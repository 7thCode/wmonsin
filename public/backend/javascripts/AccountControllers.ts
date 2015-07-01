/**
 AccountControllers.js

 Copyright (c) 2015 7ThCode.

 This software is released under the MIT License.

 http://opensource.org/licenses/mit-license.php

 */

///<reference path="../../../../DefinitelyTyped/lib.d.ts"/>
///<reference path="../../../../DefinitelyTyped/angularjs/angular.d.ts"/>
///<reference path="../../../../DefinitelyTyped/socket.io/socket.io.d.ts" />
///<reference path="../../../../DefinitelyTyped/fabricjs/fabricjs.d.ts" />
///<reference path="../../../../DefinitelyTyped/lodash/lodash.d.ts" />


/**
 0 - ok
 1 - rights
 2 - auth
 3 - user already found
 10 - db
 20 - session
 100 - auth

 Init
 Accepted
 Done

 */
'use strict';

var controllers = angular.module('AccountControllers', ["ngMaterial", "ngResource", 'ngMessages', 'ngMdIcons']);

//,'common.fabric','common.fabric.canvas', 'common.fabric.window', 'common.fabric.directive','common.fabric.dirtyStatus','common.fabric.utilities', 'common.fabric.constants'

controllers.value('Global',
    {
        socket: null
    }
);

controllers.value("CurrentPatient", {
    'id': ""
});

controllers.value("CurrentAccount", {
    'username': "",
    'type': ""
});

controllers.value("Views", {
        Data: {}
    }
);

controllers.factory('ViewItem', ['$resource',
    function ($resource:any):any {
        return $resource('/view', {}, {
            //    get: {method: 'GET'}
        });
    }]);

// Account resource
controllers.factory('Login', ['$resource',
    function ($resource:any):any {
        return $resource('/account/login', {}, {
            login: {method: 'POST'}
        });
    }]);

// Account resource
controllers.factory('Logout', ['$resource',
    function ($resource:any):any {
        return $resource('/account/logout', {}, {
            logout: {method: 'POST'}
        });
    }]);

controllers.factory('AccountQuery', ['$resource',
    function ($resource:any):any {
        return $resource('/account/query/:query', {query: '@query'}, {
            query: {method: 'GET'}
        });
    }]);

controllers.factory('Account', ['$resource',
    function ($resource:any):any {
        return $resource('/account/:id', {}, {
            //    get: {method: 'GET'},
            update: {method: 'PUT'},
            remove: {method: 'DELETE'}
        });
    }]);

controllers.factory('AccountPassword', ['$resource',
    function ($resource):any {
        return $resource('/account/password/:id', {}, {
            update: {method: 'PUT'}
        });
    }]);

controllers.factory('AccountCreate', ['$resource',
    function ($resource:any):any {
        return $resource('/account/create', {}, {
            //       save: {method: 'POST'}
        });
    }]);

controllers.factory('PatientAccept', ['$resource',
    function ($resource:any):any {
        return $resource('/patient/accept', {}, {
            //     save: {method: 'POST'}
        });
    }]);

// Patient resource
controllers.factory('PatientQuery', ['$resource',
    function ($resource:any):any {
        return $resource('/patient/query/:query', {query: '@query'}, {
            query: {method: 'GET'}
        });
    }]);

controllers.factory('Patient', ['$resource',
    function ($resource:any):any {
        return $resource('/patient/:id', {}, {
            //    get: {method: 'GET'},
            update: {method: 'PUT'},
            remove: {method: 'DELETE'}
        });
    }]);

controllers.factory('PatientStatus', ['$resource',
    function ($resource:any):any {
        return $resource('/patient/status/:id', {}, {
            //    get: {method: 'GET'},
            update: {method: 'PUT'}
        });
    }]);

controllers.factory('Config', ['$resource',
    function ($resource:any):any {
        return $resource('/config', {}, {
            //     get: {method: 'GET'},
            update: {method: 'PUT'}
        });
    }]);

function List(resource:any, query:any, success:any):void {
    var result:any = [];

    var today:Date = new Date();
    today.setHours(23, 59, 59, 99);
    var yesterday:Date = new Date();
    yesterday.setHours(0, 0, 0, 1);
    var query:any = {$and: [{Date: {$lte: today}}, {Date: {$gt: yesterday}}]};

    resource.query({query: encodeURIComponent(JSON.stringify(query))}, function (data:any, headers:any):void {
        if (data != null) {
            if (data.code == 0) {
                success(data.value, headers);
            }
        }
    });
}

function AccountsList(resource:any, query:any, success:any):void {
    var result:any = [];
    var query:any = {};

    resource.query({query: encodeURIComponent(JSON.stringify(query))}, function (data:any):void {
        if (data != null) {
            if (data.code == 0) {
                success(data.value);
            }
        }
    });
}

function SetAccount(CurrentAccount:any, $scope:any):void {
    var account = JSON.parse(localStorage.getItem("account"));
    CurrentAccount.username = account.username;
    CurrentAccount.type = account.type;
    $scope.username = CurrentAccount.username;
    $scope.type = CurrentAccount.type;
}

function ClearAccount(CurrentAccount:any, $scope:any):void {
    CurrentAccount.username = "";
    CurrentAccount.type = "";
    $scope.username = "";
    $scope.type = "";
}

function Init(CurrentAccount:any, $scope:any):void {
    if (localStorage.getItem("account") != null) {
        SetAccount(CurrentAccount, $scope);
    }
    else {
        ClearAccount(CurrentAccount, $scope);
    }
}

/*! Controllers  */
controllers.controller("StartController", ["$scope", "$state", 'CurrentAccount', 'ViewItem', 'Views',
    function ($scope:any, $state:any, CurrentAccount:any, ViewItem:any, Views:any):void {

        if (localStorage.getItem("account") != null) {
            var account = JSON.parse(localStorage.getItem("account"));
            CurrentAccount.username = account.username;
            CurrentAccount.type = account.type;
        }
        else {
            CurrentAccount.username = "";
            CurrentAccount.type = "";
        }

        if (CurrentAccount.type != "") {
            $state.go('patients');
        }

        var resource = new ViewItem();
        resource.$get({}, function (data:any, headers:any):void {
            if (data != null) {
                if (data.code == 0) {

                    Views.Data = data.value[0].Data;
                }
            }
        });
    }]);

controllers.controller("ApplicationController", ["$scope", "$rootScope", "$mdDialog", '$mdToast', '$state', 'Login', 'Logout', 'CurrentAccount', 'Global',
    function ($scope:any, $rootScope:any, $mdDialog:any, $mdToast:any, $state:any, Login:any, Logout:any, CurrentAccount:any, Global:any):void {

        $scope.mode = "Patient";

        Init(CurrentAccount, $scope);

        $scope.goTop = function ():void {
            $state.go('start');
        };

        $scope.goConfig = function ():void {
            $state.go('controlles');
        };

        $scope.goPatient = function ():void {
            $scope.mode = "Patient";
            $state.go('patients');
        };

        $scope.goAccount = function ():void {
            $scope.mode = "Account";
            $state.go('accounts');
        };

        $scope.showLoginDialog = function (id:any):void { // Login Dialog

            $mdDialog.show({
                controller: 'LoginDialogController',
                templateUrl: '/backend/partials/account/logindialog',
                targetEvent: id
            })
                .then(function (answer:any):void { // Answer
                    var resource = new Login();
                    resource.username = answer.items.username;
                    resource.password = answer.items.password;

                    resource.$login(function (account:any):void {
                        if (account.code == 0) {
                            CurrentAccount.username = account.value.username;
                            CurrentAccount.type = account.value.type;
                            $scope.username = CurrentAccount.username;
                            $scope.type = CurrentAccount.type;
                            localStorage.setItem("account", JSON.stringify(CurrentAccount));
                            $rootScope.$broadcast('Login');
                        }
                        $mdToast.show($mdToast.simple().content(account.message));
                    });
                }, function ():void { // Error
                });
        };

        $scope.Logout = function (id:any):void { // Login Dialog

            var resource = new Logout();
            resource.$logout(function (account:any):void {
                if (account.code == 0) {
                    CurrentAccount.username = "";
                    CurrentAccount.type = "";
                    $scope.username = "";
                    $scope.type = "";
                    localStorage.removeItem("account");
                    $rootScope.$broadcast('Logout');
                    $state.go('start');
                }
                $mdToast.show($mdToast.simple().content(account.message));
            });
        };

        if (Global.socket == null) {
            Global.socket = io.connect();
        }

    }]);

controllers.controller('PatientsController', ['$scope', "$mdDialog", '$mdBottomSheet', '$mdToast', '$state', 'Patient', 'PatientAccept', 'PatientQuery', 'CurrentAccount', 'CurrentPatient', 'Global',
    function ($scope:any, $mdDialog:any, $mdBottomSheet:any, $mdToast:any, $state:any, Patient:any, PatientAccept:any, PatientQuery:any, CurrentAccount:any, CurrentPatient:any, Global:any):void {

        $scope.username = CurrentAccount.username;
        $scope.type = CurrentAccount.type;
        $scope.progress = true;
        List(PatientQuery, {}, function (data:any, headers:any):void {
            $scope.progress = false;
            $scope.patients = data;
        });

        $scope.showPatientDescription = function (id:any):void {
            CurrentPatient.id = id;
            $state.go('description');
        };

        $scope.icon = "vertical_align_top";
        $scope.showSheet = function ($event:any):void {

            $scope.icon = "vertical_align_bottom";

            $mdBottomSheet.show({
                templateUrl: '/backend/partials/patient/sheet',
                controller: 'PatientSheetControl',
                targetEvent: $event
            }).then(function (clickedItem) {
                $scope.icon = "vertical_align_top";
            }, function () {
                $scope.icon = "vertical_align_top";
            });
        };

        $scope.showPatientAcceptDialog = function (id:any):void { // Register Dialog

            $mdDialog.show({
                controller: 'PatientAcceptDialogController',
                templateUrl: '/backend/partials/patient/patientacceptdialog',
                targetEvent: id
            })
                .then(function (answer:any):void { // Answer

                    PatientQuery();

                    var resource = new PatientAccept();
                    resource.Input = {};
                    resource.Information = {};
                    resource.Information.name = answer.items.name;

                    var now = new Date();
                    var hour = ("0" + now.getHours()).slice(-2); // 時
                    var min = ("0" + now.getMinutes()).slice(-2); // 分
                    var sec = ("0" + now.getSeconds()).slice(-2); // 秒
                    resource.Information.time = hour + ':' + min + ':' + sec;

                    answer.items.kana = answer.items.kana.replace(/[ぁ-ん]/g, function (s) {
                        return String.fromCharCode(s.charCodeAt(0) + 0x60);
                    });

                    resource.Information.kana = answer.items.kana;

                    resource.Information.insurance = answer.items.insurance;
                    resource.Category = answer.items.category;
                    $scope.progress = true;
                    resource.$save({}, function (result, header) {
                        if (result.code == 0) {
                            List(PatientQuery, {}, function (data, headers) {
                                $scope.progress = false;
                                Global.socket.emit('server', {value: "1"});
                                $scope.patients = data;
                            });
                        }
                        $mdToast.show($mdToast.simple().content(result.message));

                    });
                }, function ():void { // Cancel

                });
        };

        $scope.$on('Login', function ():void {
            $scope.progress = true;
            List(PatientQuery, {}, function (data:any, headers:any):void {
                $scope.patients = data;
                $scope.progress = false;
            });
        });

        $scope.$on('Logout', function ():void {
            $scope.patients = [];
        });

        $scope.$on('Update', function ():void {
            $scope.progress = true;
            List(PatientQuery, {}, function (data:any, headers:any):void {
                $scope.patients = data;
                $scope.progress = false;
            });
        });

        Global.socket.on('client', function (data:any):void {
            if (data.value === "1") {
                $scope.progress = true;
                List(PatientQuery, {}, function (data:any, headers:any):void {
                    $scope.patients = data;
                    $scope.progress = false;
                });
            }
        });
    }]);

controllers.controller('DescriptionController', ['$scope', '$mdBottomSheet', '$mdToast', 'Patient', 'PatientStatus', 'CurrentAccount', 'CurrentPatient', 'Global',
    function ($scope:any, $mdBottomSheet:any, $mdToast:any, Patient:any, PatientStatus:any, CurrentAccount:any, CurrentPatient:any, Global:any):void {

        Init(CurrentAccount, $scope);

        var resource = new Patient();
        resource.$get({id: CurrentPatient.id}, function (data:any, headers:any):void {
                if (data != null) {
                    if (data.code == 0) {
                        $scope.Input = [];
                        _.each(data.value.Input, function (value:any, index:any, array:any):void {

                            if (value.type == "picture") {
                                var canvas = new fabric.Canvas('cc');
                                var hoge = JSON.stringify(value.value);
                                canvas.loadFromJSON(hoge, canvas.renderAll.bind(canvas), function (o:any, object:any):void {
                                });
                            }
                            $scope.Input.push(value);
                        });
                    }
                    else {
                        $mdToast.show($mdToast.simple().content(data.message));
                    }
                }
                else {
                    $mdToast.show($mdToast.simple().content('error'));
                }
            }
        );

        $scope.icon = "vertical_align_top";
        $scope.showSheet = function ($event:any):void {
            $scope.icon = "vertical_align_bottom";
            $mdBottomSheet.show({
                templateUrl: '/backend/partials/patient/sheet',
                controller: 'PatientSheetControl',
                targetEvent: $event
            }).then(function (clickedItem:any):void {
                $scope.icon = "vertical_align_top";
            }, function ():void {
                $scope.icon = "vertical_align_top"
            });
        };

        $scope.done = function ():void {
            var resource = new Patient();
            resource.$remove({id: CurrentPatient.id}, function (result:any, headers:any):void {
                if (result.code == 0) {
                    $mdToast.show($mdToast.simple().content('Done.'));
                } else {
                    $mdToast.show($mdToast.simple().content(result.message));
                }
            });
        };

        $scope.download = function (event:any):void {
            var canvas = document.getElementById("cc");
            Canvas2Image.saveAsPNG(canvas);
        };

        var resource = new PatientStatus();
        resource.$get({id: CurrentPatient.id}, function (result:any, headers:any):void {
            if (result.code == 0) {
                $scope.IsDone = (result.value == "Done");
            } else {
                $mdToast.show($mdToast.simple().content(result.message));
            }
        });

        $scope.$watch('IsDone', function ():void {
            if ($scope.IsDone != null)  // avoid initalizeation.
            {
                var resource:any = new PatientStatus();
                resource.$get({id: CurrentPatient.id}, function (result:any, headers:any):void {
                    if (result.code == 0) {
                        if ($scope.IsDone == true) {
                            if (result.value != "Done") {
                                resource.Status = "Done";
                                resource.$update({id: CurrentPatient.id}, function (result:any, headers:any):void {
                                    if (result.code == 0) {
                                        Global.socket.emit('server', {value: "1"});
                                        $mdToast.show($mdToast.simple().content('Status Updated.'));
                                    }
                                });
                            }
                        }
                        else {
                            if (result.value != "Accepted") {
                                resource.Status = "Accepted";
                                resource.$update({id: CurrentPatient.id}, function (result:any, headers:any):void {
                                    if (result.code == 0) {
                                        Global.socket.emit('server', {value: "1"});
                                        $mdToast.show($mdToast.simple().content('Status Updated.'));
                                    }
                                });
                            }
                        }
                    } else {
                        $mdToast.show($mdToast.simple().content(result.message));
                    }
                });
            }
        });
    }]);

controllers.controller('AccountsController', ['$scope', "$mdDialog", '$mdToast', 'Account', 'AccountQuery', 'AccountCreate', 'AccountPassword', 'CurrentAccount',
    function ($scope:any, $mdDialog:any, $mdToast:any, Account:any, AccountQuery:any, AccountCreate:any, AccountPassword:any, CurrentAccount:any):void {

        $scope.username = CurrentAccount.username;
        $scope.type = CurrentAccount.type;
        $scope.progress = true;
        AccountsList(AccountQuery, {}, function (data:any):void {
            $scope.progress = false;
            $scope.accounts = data;
        });

        $scope.showRegisterDialog = function (id:any):void { // Register Dialog

            $mdDialog.show({
                controller: 'RegisterDialogController',
                templateUrl: '/backend/partials/account/registerdialog',
                targetEvent: id
            })
                .then(function (answer:any):void { // Answer
                    var resource = new AccountCreate();
                    resource.username = answer.items.username;
                    resource.password = answer.items.password;
                    resource.type = answer.items.type;
                    $scope.progress = true;
                    resource.$save({}, function (result:any, header:any):void {
                        if (result.code == 0) {
                            AccountsList(AccountQuery, {}, function (data:any):void {
                                $scope.accounts = data;
                                $scope.progress = false;
                                $mdToast.show($mdToast.simple().content('Regist.'));
                            });
                        }
                        $mdToast.show($mdToast.simple().content(result.message));
                    });

                }, function ():void { // Cancel

                });
        };

        $scope.showAccountDeleteDialog = function (id:any):void {  // Delete Dialog

            $mdDialog.show({
                controller: 'AccountDeleteDialogController',
                templateUrl: '/backend/partials/account/deletedialog',
                targetEvent: id
            })
                .then(function (answer:any):void {  // Answer
                    var resource = new Account();
                    $scope.progress = true;
                    resource.$remove({id: id}, function (result:any, _headers:any):void {
                        if (result.code == 0) {
                            AccountsList(AccountQuery, {}, function (data:any):void {
                                $scope.accounts = data;
                                $scope.progress = false;
                                $mdToast.show($mdToast.simple().content('Deleted.'));
                            });
                        } else {
                            $mdToast.show($mdToast.simple().content(result.message));
                        }
                    });
                }, function ():void { //Cancel
                });
        };

        $scope.showAccountUpdateDialog = function (id:any):void { // Account Update Dialog

            var resource = new Account();
            resource.$get({id: id}, function (data:any, headers:any):void {
                    if (data != null) {
                        if (data.code == 0) {
                            $scope.items = data.value;
                            $scope.items.password = "";
                            $mdDialog.show({
                                controller: 'AccountUpdateDialogController',
                                templateUrl: '/backend/partials/account/accountdialog',
                                targetEvent: id,
                                locals: {
                                    items: $scope.items
                                }
                            })
                                .then(function (answer:any):void { // Answer
                                    switch (answer.a) {
                                        case 1:
                                        {
                                            var post = new AccountPassword();
                                            post.password = answer.items.password;
                                            post.$update({id: id}, function (result, header) {
                                                if (result.code == 0) {
                                                    $mdToast.show($mdToast.simple().content('Password Updated.'));
                                                } else {
                                                    $mdToast.show($mdToast.simple().content(result.message));
                                                }
                                            });
                                        }
                                        case 2:
                                        {
                                            var post = new Account();
                                            post.username = answer.items.username;
                                            post.type = answer.items.type;
                                            $scope.progress = true;
                                            post.$update({id: id}, function (result, headers) {
                                                if (result.code == 0) {
                                                    AccountsList(AccountQuery, {}, function (data) {
                                                        $scope.accounts = data;
                                                        $scope.progress = false;
                                                        //     Global.socket.emit('server', {value: "1"});
                                                        $mdToast.show($mdToast.simple().content('Updated.'));
                                                    });
                                                } else {
                                                    $mdToast.show($mdToast.simple().content(result.message));
                                                }
                                            });
                                        }
                                    }
                                }, function () { // Cancel
                                });
                        }
                        else {
                            $mdToast.show($mdToast.simple().content(data.message));
                        }
                    }
                }
            );
        };

        $scope.$on('Login', function ():void {
            $scope.progress = true;
            AccountsList(AccountQuery, {}, function (data:any):void {
                $scope.accounts = data;
                $scope.progress = false;
            });
        });

        $scope.$on('Logout', function ():void {
            $scope.accounts = [];
        });

        $scope.$on('Update', function ():void {
            $scope.progress = true;
            AccountsList(AccountQuery, {}, function (data:any):void {
                $scope.accounts = data;
                $scope.progress = false;
            });
        });

    }]);

controllers.controller('ControllpanelController', ['$scope', '$mdToast', '$mdBottomSheet', '$mdDialog', 'Config',
    function ($scope:any, $mdToast:any, $mdBottomSheet:any, $mdDialog:any, Config:any):void {

        var resource = new Config();
        resource.$get({}, function (result:any, headers:any):void {
            if (result.code == 0) {
                $scope.config = result.value;
            } else {
                $mdToast.show($mdToast.simple().content(result.message));
            }
        });

        $scope.showNotificationDialog = function ():void {  // Delete Dialog
            $mdDialog.show({
                controller: 'NotificationDialogController',
                templateUrl: '/backend/partials/controll/notification',
                targetEvent: ""
            })
                .then(function (answer:any):void {  // Answer
                    var resource = new Config();
                    resource.body = $scope.config;
                    resource.$update({}, function (result:any, headers:any):void {
                        if (result.code == 0) {
                            $mdToast.show($mdToast.simple().content('Updated.'));
                        } else {
                            $mdToast.show($mdToast.simple().content(result.message));
                        }
                    });
                }, function ():void { //Cancel
                });
        };

        $scope.icon = "vertical_align_top";
        $scope.showSheet = function ($event:any):void {
            $scope.icon = "vertical_align_bottom";
            $mdBottomSheet.show({
                templateUrl: '/backend/partials/patient/sheet',
                controller: 'PatientSheetControl',
                targetEvent: $event
            }).then(function (clickedItem:any):void {
                $scope.icon = "vertical_align_top";
            }, function ():void {
                $scope.icon = "vertical_align_top"
            });
        };

    }]);

controllers.controller('PatientSheetControl', ['$scope', '$mdBottomSheet',
    function ($scope:any, $mdBottomSheet:any):void {

        $scope.items = [
            {name: 'Archive', icon: 'archive'},
            {name: 'Mail', icon: 'mail'},
            {name: 'Message', icon: 'message'},
            {name: 'Copy', icon: 'content_copy'},
            {name: 'Create', icon: 'create'},
            {name: 'Inbox', icon: 'inbox'},
        ];

        $scope.ItemClick = function ($index:any):void {
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide(clickedItem);
        };

    }]);

controllers.controller('LoginDialogController', ['$scope', '$mdDialog',
    function ($scope:any, $mdDialog:any):void {

        $scope.hide = function ():void {
            $mdDialog.hide();
        };

        $scope.cancel = function ():void {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer:any):void {
            $mdDialog.hide($scope);
        };

    }]);

controllers.controller('RegisterDialogController', ['$scope', '$mdDialog',
    function ($scope:any, $mdDialog:any):void {

        $scope.hide = function ():void {
            $mdDialog.hide();
        };

        $scope.cancel = function ():void {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer:any):void {
            $mdDialog.hide($scope);
        };

    }]);

controllers.controller('AccountDeleteDialogController', ['$scope', '$mdDialog',
    function ($scope:any, $mdDialog:any):void {

        $scope.hide = function ():void {
            $mdDialog.hide();
        };

        $scope.cancel = function ():void {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer:any):void {
            $mdDialog.hide($scope);
        };

    }]);

controllers.controller('AccountUpdateDialogController', ['$scope', '$mdDialog', 'items',
    function ($scope:any, $mdDialog:any, items:any):void {

        $scope.items = items;

        $scope.hide = function ():void {
            $mdDialog.hide();
        };

        $scope.cancel = function ():void {
            $mdDialog.cancel();
        };

        $scope.changePassword = function (answer:any):void {
            $scope.a = 1;
            $mdDialog.hide($scope);
        };

        $scope.answer = function (answer:any):void {
            $scope.a = 2;
            $mdDialog.hide($scope);
        };

    }]);

controllers.controller('NotificationDialogController', ['$scope', '$mdDialog',
    function ($scope:any, $mdDialog:any):void {

        $scope.hide = function ():void {
            $mdDialog.hide();
        };

        $scope.cancel = function ():void {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer:any):void {
            $mdDialog.hide($scope);
        };

    }]);

controllers.controller('PatientAcceptDialogController', ['$scope', '$mdDialog', 'Views',
    function ($scope:any, $mdDialog:any, Views:any):void {

        $scope.categories = [];

        _.map(Views.Data, function (num:any, key:any):void {
            $scope.categories.push(key);
        });

        $scope.hide = function ():void {
            $mdDialog.hide();
        };

        $scope.cancel = function ():void {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer:any):void {
            $mdDialog.hide($scope);
        };

    }]);
