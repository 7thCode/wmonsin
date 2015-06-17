/**
 AccountControllers.js

 Copyright (c) 2015 7ThCode.

 This software is released under the MIT License.

 http://opensource.org/licenses/mit-license.php

 */

///<reference path="../../../lib/lib.d.ts"/>
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

var controllers = angular.module('AccountControllers', ["ngMaterial", "ngResource",'ngMessages', 'ngMdIcons']);

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

controllers.factory('ViewItem', ['$resource', function ($resource):any {

    return $resource('/view', {}, {
        get: {method: 'GET'}
    });
}]);

// Account resource
controllers.factory('Login', ['$resource', function ($resource):any {
    return $resource('/account/login', {}, {
        login: {method: 'POST'}
    });
}]);

// Account resource
controllers.factory('Logout', ['$resource', function ($resource):any {
    return $resource('/account/logout', {}, {
        logout: {method: 'POST'}
    });
}]);

controllers.factory('AccountQuery', ['$resource', function ($resource):any {
    return $resource('/account/query/:query', {query: '@query'}, {
        query: {
            method: 'GET'
        }
    });
}]);

controllers.factory('Account', ['$resource', function ($resource):any {
    return $resource('/account/:id', {}, {
        get: {method: 'GET'},
        update: {method: 'PUT'},
        remove: {method: 'DELETE'}
    });
}]);

controllers.factory('AccountPassword', ['$resource', function ($resource):any {
    return $resource('/account/password/:id', {}, {
        update: {method: 'PUT'}
    });
}]);

controllers.factory('AccountCreate', ['$resource', function ($resource):any {
    return $resource('/account/create', {}, {
        save: {method: 'POST'}
    });
}]);

controllers.factory('PatientAccept', ['$resource', function ($resource):any {
    return $resource('/patient/accept', {}, {
        save: {method: 'POST'}
    });
}]);

// Patient resource
controllers.factory('PatientQuery', ['$resource', function ($resource):any {
    return $resource('/patient/query/:query', {query: '@query'}, {
        query: {method: 'GET'}
    });
}]);

controllers.factory('Patient', ['$resource', function ($resource):any {
    return $resource('/patient/:id', {}, {
        get: {method: 'GET'},
        update: {method: 'PUT'},
        remove: {method: 'DELETE'}
    });
}]);

controllers.factory('PatientStatus', ['$resource', function ($resource):any {
    return $resource('/patient/status/:id', {}, {
        get: {method: 'GET'},
        update: {method: 'PUT'}
    });
}]);

controllers.factory('Config', ['$resource', function ($resource):any {
    return $resource('/config', {}, {
        get: {method: 'GET'},
        update: {method: 'PUT'}
    });
}]);

function List(resource, query, success) {
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

function AccountsList(resource, query, success) {
 var result:any = [];
 var query:any = {};

 resource.query({query: encodeURIComponent(JSON.stringify(query))}, function (data) {
  if (data != null) {
   if (data.code == 0) {
    success(data.value);
   }
  }
 });
}

function SetAccount(CurrentAccount, $scope) {
    var account = JSON.parse(localStorage.getItem("account"));
    CurrentAccount.username = account.username;
    CurrentAccount.type = account.type;
    $scope.username = CurrentAccount.username;
    $scope.type = CurrentAccount.type;
}

function ClearAccount(CurrentAccount, $scope) {
    CurrentAccount.username = "";
    CurrentAccount.type = "";
    $scope.username = "";
    $scope.type = "";
}

function Init(CurrentAccount, $scope) {
    if (localStorage.getItem("account") != null) {
        SetAccount(CurrentAccount, $scope);
    }
    else {
        ClearAccount(CurrentAccount, $scope);
    }
}

/*! Controllers  */
controllers.controller("StartController", ["$scope", "$location", 'CurrentAccount', 'ViewItem','Views',
    function ($scope, $location, CurrentAccount, ViewItem, Views) {

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
            $location.path('/patients');
        }

        var resource = new ViewItem();
        resource.$get({}, function (data, headers) {
            if (data != null) {
                if (data.code == 0) {
                    var hoge = data.value[0].Data;
                    Views.Data = hoge;
                }
            }
        });
    }]);

controllers.controller("ApplicationController", ["$scope", "$rootScope", "$mdDialog", '$mdToast', '$location', 'Login', 'Logout', 'CurrentAccount', 'Global',
    function ($scope, $rootScope, $mdDialog, $mdToast, $location, Login, Logout, CurrentAccount, Global) {

        $scope.mode = "Patient";

        Init(CurrentAccount, $scope);

        $scope.goTop = function () {
            $location.path('/');
        };

        $scope.goConfig = function () {
            $location.path('/controlles');
        };

        $scope.goPatient = function () {
            $scope.mode = "Patient";
            $location.path('/patients');
        };

        $scope.goAccount = function () {
            $scope.mode = "Account";
            $location.path('/accounts');
        };

        $scope.showLoginDialog = function (id) { // Login Dialog

            $mdDialog.show({
                controller: 'LoginDialogController',
                templateUrl: 'partials/account/logindialog.html',
                targetEvent: id
            })
                .then(function (answer) { // Answer
                    var resource = new Login();
                    resource.username = answer.items.username;
                    resource.password = answer.items.password;

                    resource.$login(function (account) {
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
                }, function () { // Error
                });
        };

        $scope.Logout = function (id) { // Login Dialog

            var resource = new Logout();
            resource.$logout(function (account) {
                if (account.code == 0) {
                    CurrentAccount.username = "";
                    CurrentAccount.type = "";
                    $scope.username = "";
                    $scope.type = "";
                    localStorage.removeItem("account");
                    $rootScope.$broadcast('Logout');
                    $location.path('/start');
                }
                $mdToast.show($mdToast.simple().content(account.message));
            });
        };

        if (Global.socket == null) {
            Global.socket = io.connect();
        }

    }]);

controllers.controller('PatientsController', ['$scope', "$mdDialog", '$mdBottomSheet', '$mdToast', '$location', 'Patient', 'PatientAccept', 'PatientQuery', 'CurrentAccount', 'CurrentPatient', 'Global',
    function ($scope, $mdDialog, $mdBottomSheet, $mdToast, $location, Patient, PatientAccept, PatientQuery, CurrentAccount, CurrentPatient, Global):void {

        $scope.username = CurrentAccount.username;
        $scope.type = CurrentAccount.type;
        List(PatientQuery, {}, function (data, headers) {
            $scope.patients = data;
        });

        $scope.showPatientDescription = function (id) {
            CurrentPatient.id = id;
            $location.path('/description');
        };

        $scope.icon = "vertical_align_top";
        $scope.showSheet = function ($event) {

            $scope.icon = "vertical_align_bottom";

            $mdBottomSheet.show({
                templateUrl: 'partials/patient/sheet.html',
                controller: 'PatientSheetControl',
                targetEvent: $event
            }).then(function (clickedItem) {
                $scope.icon = "vertical_align_top";
            }, function () {
                $scope.icon = "vertical_align_top";
            });
        };

        $scope.showPatientAcceptDialog = function (id) { // Register Dialog

            $mdDialog.show({
                controller: 'PatientAcceptDialogController',
                templateUrl: 'partials/patient/patientacceptdialog.html',
                targetEvent: id
            })
                .then(function (answer) { // Answer

                    PatientQuery();

                    var resource = new PatientAccept();
                    resource.Input = {};
                    resource.Information = {};
                    resource.Information.name = answer.items.name;

                    var now = new Date();
                    var hour = ("0"+ now.getHours()).slice(-2) ; // 時
                    var min = ("0"+ now.getMinutes()).slice(-2) ; // 分
                    var sec = ("0"+ now.getSeconds()).slice(-2) ; // 秒
                    resource.Information.time = hour + ':' + min + ':' + sec;

                    answer.items.kana = answer.items.kana.replace(/[ぁ-ん]/g, function (s) {
                        return String.fromCharCode(s.charCodeAt(0) + 0x60);
                    });

                    resource.Information.kana = answer.items.kana;

                    resource.Information.insurance = answer.items.insurance;
                    resource.Category = answer.items.category;
                    resource.$save({}, function (result, header) {
                        if (result.code == 0) {
                            List(PatientQuery, {}, function (data, headers) {
                                Global.socket.emit('server', {value: "1"});
                                $scope.patients = data;
                            });
                        }
                        $mdToast.show($mdToast.simple().content(result.message));

                    });
                }, function () { // Cancel

                });
        };

        $scope.$on('Login', function () {
            List(PatientQuery, {}, function (data, headers) {
                $scope.patients = data;
            });
        });

        $scope.$on('Logout', function () {
            $scope.patients = [];
        });

        $scope.$on('Update', function () {
            List(PatientQuery, {}, function (data, headers) {
                $scope.patients = data;
            });
        });

        Global.socket.on('client', function (data):void {
            if (data.value === "1") {
                List(PatientQuery, {}, function (data, headers) {
                    $scope.patients = data;
                });
            }
        });
    }]);

controllers.controller('DescriptionController', ['$scope', '$mdBottomSheet', '$mdToast', '$location', 'Patient', 'PatientStatus', 'CurrentAccount', 'CurrentPatient', 'Global',
    function ($scope, $mdBottomSheet, $mdToast, $location, Patient, PatientStatus, CurrentAccount, CurrentPatient, Global):void {

        Init(CurrentAccount, $scope);

        var resource = new Patient();
        resource.$get({id: CurrentPatient.id}, function (data, headers) {
                if (data != null) {
                    if (data.code == 0) {

                        $scope.Input = [];
                        _.each(data.value.Input, function (value: any, index, array) {

                            if (value.type == "picture") {
                                var canvas = new fabric.Canvas('cc');
                                var hoge = JSON.stringify(value.value);
                                canvas.loadFromJSON(hoge, canvas.renderAll.bind(canvas), function (o, object) {

                                    object.lockMovementX = true;
                                    object.lockMovementY = true;
                                    object.lockRotation = true;
                                    object.lockScaling = true;
                                    object.hasControls = false;
                                    object.hasBorders = false;

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
        $scope.showSheet = function ($event) {
            $scope.icon = "vertical_align_bottom";
            $mdBottomSheet.show({
                templateUrl: 'partials/patient/sheet.html',
                controller: 'PatientSheetControl',
                targetEvent: $event
            }).then(function (clickedItem) {
                $scope.icon = "vertical_align_top";
            }, function () {
                $scope.icon = "vertical_align_top"
            });
        };

        $scope.done = function () {
            var resource = new Patient();
            resource.$remove({id: CurrentPatient.id}, function (result, headers) {
                if (result.code == 0) {
                    $mdToast.show($mdToast.simple().content('Done.'));
                } else {
                    $mdToast.show($mdToast.simple().content(result.message));
                }
            });
        };

        $scope.download = function (event) {
            var canvas = document.getElementById("cc");
            Canvas2Image.saveAsPNG(canvas);
        };

        var resource = new PatientStatus();
        resource.$get({id: CurrentPatient.id}, function (result, headers) {
            if (result.code == 0) {
                $scope.IsDone = (result.value == "Done");
            } else {
                $mdToast.show($mdToast.simple().content(result.message));
            }
        });

        $scope.$watch('IsDone', function () {
            if ($scope.IsDone != null)  // avoid initalizeation.
            {
                var resource = new PatientStatus();
                resource.$get({id: CurrentPatient.id}, function (result, headers) {
                    if (result.code == 0) {
                        if ($scope.IsDone == true) {
                            if (result.value != "Done") {
                                resource.Status = "Done";
                                resource.$update({id: CurrentPatient.id}, function (result, headers) {
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
                                resource.$update({id: CurrentPatient.id}, function (result, headers) {
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

controllers.controller('AccountsController', ['$scope', "$mdDialog", '$mdToast', '$location', 'Account', 'AccountQuery', 'AccountCreate', 'AccountPassword', 'CurrentAccount',
    function ($scope, $mdDialog, $mdToast, $location, Account, AccountQuery, AccountCreate, AccountPassword, CurrentAccount):void {

        $scope.username = CurrentAccount.username;
        $scope.type = CurrentAccount.type;
        AccountsList(AccountQuery, {}, function (data) {
            $scope.accounts = data;
        });

        $scope.showRegisterDialog = function (id) { // Register Dialog

            $mdDialog.show({
                controller: 'RegisterDialogController',
                templateUrl: 'partials/account/registerdialog.html',
                targetEvent: id
            })
                .then(function (answer) { // Answer
                    var resource = new AccountCreate();
                    resource.username = answer.items.username;
                    resource.password = answer.items.password;
                    resource.type = answer.items.type;
                    resource.$save({}, function (result, header) {
                        if (result.code == 0) {
                         AccountsList(AccountQuery, {}, function (data) {
                                $scope.accounts = data;
                                $mdToast.show($mdToast.simple().content('Regist.'));
                            });
                        }
                        $mdToast.show($mdToast.simple().content(result.message));
                    });
                }, function () { // Cancel

                });
        };

        $scope.showAccountDeleteDialog = function (id) {  // Delete Dialog

            $mdDialog.show({
                controller: 'AccountDeleteDialogController',
                templateUrl: 'partials/account/deletedialog.html',
                targetEvent: id
            })
                .then(function (answer) {  // Answer
                    var resource = new Account();
                    resource.$remove({id: id}, function (result, _headers) {
                        if (result.code == 0) {
                         AccountsList(AccountQuery, {}, function (data) {
                                $scope.accounts = data;
                                $mdToast.show($mdToast.simple().content('Deleted.'));
                            });
                        } else {
                            $mdToast.show($mdToast.simple().content(result.message));
                        }
                    });
                }, function () { //Cancel

                });
        };

        $scope.showAccountUpdateDialog = function (id) { // Account Update Dialog

            var resource = new Account();
            resource.$get({id: id}, function (data, headers) {
                    if (data != null) {
                        if (data.code == 0) {
                            $scope.items = data.value;
                            $scope.items.password = "";
                            $mdDialog.show({
                                controller: 'AccountUpdateDialogController',
                                templateUrl: 'partials/account/accountdialog.html',
                                targetEvent: id,
                                locals: {
                                    items: $scope.items
                                }
                            })
                                .then(function (answer) { // Answer
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
                                            post.$update({id: id}, function (result, headers) {
                                                if (result.code == 0) {
                                                 AccountsList(AccountQuery, {}, function (data) {
                                                        $scope.accounts = data;
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

        $scope.$on('Login', function () {
         AccountsList(AccountQuery, {}, function (data) {
                $scope.accounts = data;
            });
        });

        $scope.$on('Logout', function () {
            $scope.accounts = [];
        });

        $scope.$on('Update', function () {
         AccountsList(AccountQuery, {}, function (data) {
                $scope.accounts = data;
            });
        });
    }]);

controllers.controller('ControllpanelController', ['$scope', '$mdToast', '$mdBottomSheet', '$mdDialog', 'Config', function ($scope, $mdToast, $mdBottomSheet, $mdDialog, Config) {

    var resource = new Config();
    resource.$get({}, function (result, headers) {
        if (result.code == 0) {
            $scope.config = result.value;
        } else {
            $mdToast.show($mdToast.simple().content(result.message));
        }
    });

    $scope.showNotificationDialog = function () {  // Delete Dialog
        $mdDialog.show({
            controller: 'NotificationDialogController',
            templateUrl: 'partials/controll/notification.html',
            targetEvent: ""
        })
            .then(function (answer) {  // Answer
                var resource = new Config();
                resource.body = $scope.config;
                resource.$update({}, function (result, headers) {
                    if (result.code == 0) {
                        $mdToast.show($mdToast.simple().content('Updated.'));
                    } else {
                        $mdToast.show($mdToast.simple().content(result.message));
                    }

                });
            }, function () { //Cancel

            });
    };

    $scope.icon = "vertical_align_top";
    $scope.showSheet = function ($event) {
        $scope.icon = "vertical_align_bottom";
        $mdBottomSheet.show({
            templateUrl: 'partials/patient/sheet.html',
            controller: 'PatientSheetControl',
            targetEvent: $event
        }).then(function (clickedItem) {
            $scope.icon = "vertical_align_top";
        }, function () {
            $scope.icon = "vertical_align_top"
        });
    };

}]);

controllers.controller('PatientSheetControl', ['$scope', '$mdBottomSheet', function ($scope, $mdBottomSheet) {

    $scope.items = [
        {name: 'Archive', icon: 'archive'},
        {name: 'Mail', icon: 'mail'},
        {name: 'Message', icon: 'message'},
        {name: 'Copy', icon: 'content_copy'},
        {name: 'Create', icon: 'create'},
        {name: 'Inbox', icon: 'inbox'},
    ];

    $scope.ItemClick = function ($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };

}]);

controllers.controller('LoginDialogController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
        $mdDialog.hide($scope);
    };
}]);

controllers.controller('RegisterDialogController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {

    // $scope.items.type = "Viewer";

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
        $mdDialog.hide($scope);
    };
}]);

controllers.controller('AccountDeleteDialogController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
        $mdDialog.hide($scope);
    };
}]);

controllers.controller('AccountUpdateDialogController', ['$scope', '$mdDialog', 'items', function ($scope, $mdDialog, items) {

    $scope.items = items;

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.changePassword = function (answer) {
        $scope.a = 1;
        $mdDialog.hide($scope);
    };

    $scope.answer = function (answer) {
        $scope.a = 2;
        $mdDialog.hide($scope);
    };
}]);

controllers.controller('NotificationDialogController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
        $mdDialog.hide($scope);
    };
}]);

controllers.controller('PatientAcceptDialogController', ['$scope', '$mdDialog', 'Views', function ($scope, $mdDialog, Views) {

    $scope.categories = [];

    _.map(Views.Data, function(num, key) {
        $scope.categories.push(key);
    });

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
        $mdDialog.hide($scope);
    };
}]);
