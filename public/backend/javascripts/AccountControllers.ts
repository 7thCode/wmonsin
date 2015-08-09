/**
 AccountControllers.js

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

var controllers:angular.IModule = angular.module('AccountControllers', ["ngMaterial", "ngResource", 'ngMessages', 'ngMdIcons', 'ngAnimate']);

controllers.value('Global', {
        socket: null
    }
);

controllers.value("CurrentPatient", {
    'id': ""
});

controllers.value("CurrentView", {
    'Page': 0,
    'Data': {}
});

controllers.value("CurrentAccount", {
    'username': "",
    'type': ""
});

controllers.factory('ViewItem', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/view', {}, {});
    }]);

controllers.factory('Login', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/account/login', {}, {
            login: {method: 'POST'}
        });
    }]);

controllers.factory('Logout', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/account/logout', {}, {
            logout: {method: 'POST'}
        });
    }]);

controllers.factory('AccountQuery', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/account/query/:query', {query: '@query'}, {
            query: {method: 'GET'}
        });
    }]);

controllers.factory('Account', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/account/:id', {}, {
            update: {method: 'PUT'},
            remove: {method: 'DELETE'}
        });
    }]);

controllers.factory('AccountPassword', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/account/password/:id', {}, {
            update: {method: 'PUT'}
        });
    }]);

controllers.factory('AccountCreate', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/account/create', {}, {});
    }]);

controllers.factory('PatientAccept', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/patient/accept', {}, {});
    }]);

controllers.factory('PatientQuery', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/patient/query/:query', {query: '@query'}, {
            query: {method: 'GET'}
        });
    }]);

controllers.factory('Patient', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/patient/:id', {}, {
            update: {method: 'PUT'},
            remove: {method: 'DELETE'}
        });
    }]);



controllers.factory('PatientStatus', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/patient/status/:id', {}, {
            update: {method: 'PUT'}
        });
    }]);


controllers.factory('ViewCreate', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/view/create', {}, {});
    }]);

controllers.factory('View', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/view/:id', {}, {
            update: {method: 'PUT'},
            remove: {method: 'DELETE'}
        });
    }]);

controllers.factory('ViewQuery', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/view/query/:query', {query: '@query'}, {
            query: {method: 'GET'}
        });
    }]);

controllers.factory('Config', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/config', {}, {
            update: {method: 'PUT'}
        });
    }]);

function PatientsList(resource:any, query:any, success:(value:any, headers:any) => void):void {
    var today:Date = new Date();
    today.setHours(23, 59, 59, 99);
    var yesterday:Date = new Date();
    yesterday.setHours(0, 0, 0, 1);
    var query:any = {$and: [{Date: {$lte: today}}, {Date: {$gt: yesterday}}]};
    resource.query({query: encodeURIComponent(JSON.stringify(query))}, (data:any, headers:any):void => {
        if (data) {
            if (data.code == 0) {
                success(data.value, headers);
            }
        }
    });
}

function List(resource:any, query:any, success:(value:any) => void):void {
    var result:any[] = [];
    resource.query({query: encodeURIComponent(JSON.stringify(query))}, (data:any):void => {
        if (data) {
            if (data.code == 0) {
                success(data.value);
            }
        }
    });
}

/*
 function SetAccount(CurrentAccount:any, $scope:any):void {
 var account:any = JSON.parse(localStorage.getItem("account"));
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
 } else {
 ClearAccount(CurrentAccount, $scope);
 }
 }
 */
/*! Controllers  */
controllers.controller("StartController", ["$scope", 'CurrentAccount',
    ($scope:any, CurrentAccount:any):void => {
        /*
         if (localStorage.getItem("account") != null) {
         var account:any = JSON.parse(localStorage.getItem("account"));
         CurrentAccount.username = account.username;
         CurrentAccount.type = account.type;
         } else {
         CurrentAccount.username = "";
         CurrentAccount.type = "";
         }

         if (CurrentAccount.type != "") {
         $state.go('patients');
         }
         */
        $scope.username = CurrentAccount.username;
        $scope.type = CurrentAccount.type;


  /*      var resource:any = new ViewItem();
        resource.$get({}, (data:any):void => {
            if (data) {
                if (data.code == 0) {
                    Views.Data = data.value[0];
                }
            } else {

            }
        });
*/

    }]);

controllers.controller("ApplicationController", ["$scope", "$rootScope", "$mdDialog", '$mdToast', '$state', 'Login', 'Logout', 'CurrentAccount', 'Global',
    ($scope:any, $rootScope:any, $mdDialog:any, $mdToast:any, $state:any, Login:any, Logout:any, CurrentAccount:any, Global:any):void => {


        if (localStorage.getItem("account") != null) {
            var account:any = JSON.parse(localStorage.getItem("account"));
            CurrentAccount.username = account.username;
            CurrentAccount.type = account.type;
        } else {
            CurrentAccount.username = "";
            CurrentAccount.type = "";
        }

        $scope.username = CurrentAccount.username;
        $scope.type = CurrentAccount.type;

        $scope.mode = "Patient";

        //     Init(CurrentAccount, $scope);

        $scope.goTop = ():void => {
            $state.go('start');
        };

        $scope.goConfig = ():void => {
            $state.go('controlles');
        };

        $scope.goEdit = ():void => {
            $state.go('departments');
        };

        $scope.goPatient = ():void => {
            $scope.mode = "Patient";
            $state.go('patients');
        };

        $scope.goAccount = ():void => {
            $scope.mode = "Account";
            $state.go('accounts');
        };

        $scope.showLoginDialog = (id:any):void => {
            $mdDialog.show({
                controller: 'LoginDialogController',
                templateUrl: '/backend/partials/account/logindialog',
                targetEvent: id
            })
                .then((answer:any):void => { // Answer
                    var resource:any = new Login();
                    resource.username = answer.items.username;
                    resource.password = answer.items.password;
                    resource.$login((account:any):void => {
                        if (account) {
                            if (account.code == 0) {
                                CurrentAccount.username = account.value.username;
                                CurrentAccount.type = account.value.type;
                                $scope.username = account.value.username;
                                $scope.type = account.value.type;
                                localStorage.setItem("account", JSON.stringify(CurrentAccount));
                                $rootScope.$broadcast('Login');
                            }
                            $mdToast.show($mdToast.simple().content(account.message));
                        } else {
                            $mdToast.show($mdToast.simple().content("login error"));
                        }
                    });
                }, ():void => { // Error
                });
        };

        $scope.Logout = (id:any):void => {
            var resource:any = new Logout();
            resource.$logout((account:any):void => {
                if (account) {
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
                } else {
                    $mdToast.show($mdToast.simple().content("logout error"));
                }
            });
        };

        if (Global.socket == null) {
            Global.socket = io.connect();
        }

    }]);

controllers.controller('PatientsController', ['$scope', "$mdDialog", '$mdBottomSheet', '$mdToast', '$state', 'Patient', 'PatientAccept', 'PatientQuery', 'CurrentAccount', 'CurrentPatient', 'Global',
    ($scope:any, $mdDialog:any, $mdBottomSheet:any, $mdToast:any, $state:any, Patient:any, PatientAccept:any, PatientQuery:any, CurrentAccount:any, CurrentPatient:any, Global:any):void => {

        $scope.username = CurrentAccount.username;
        $scope.type = CurrentAccount.type;

        $scope.progress = true;
        PatientsList(PatientQuery, {}, (data:any):void => {
            $scope.patients = data;
            $scope.progress = false;
        });

        $scope.showPatientDescription = (id:any):void => {
            CurrentPatient.id = id;
            $state.go('description');
        };

        $scope.icon = "vertical_align_top";
        $scope.showSheet = ($event:any):void => {
            $scope.icon = "vertical_align_bottom";
            $mdBottomSheet.show({
                templateUrl: '/backend/partials/patient/sheet',
                controller: 'PatientSheetControl',
                targetEvent: $event
            }).then((clickedItem:any):void => {
                $scope.icon = "vertical_align_top";
            }, ():void => {
                $scope.icon = "vertical_align_top";
            });
        };

        $scope.showPatientAcceptDialog = (id:any):void => { // Register Dialog

            $mdDialog.show({
                controller: 'PatientAcceptDialogController',
                templateUrl: '/backend/partials/patient/patientacceptdialog',
                targetEvent: id
            })
                .then((answer:any):void => { // Answer

                    //PatientQuery();

                    var resource:any = new PatientAccept();
                    resource.Input = {};
                    resource.Information = {};
                    resource.Information.name = answer.items.name;

                    var now:Date = new Date();
                    var hour:string = ("0" + now.getHours()).slice(-2); // 時
                    var min:string = ("0" + now.getMinutes()).slice(-2); // 分
                    var sec:string = ("0" + now.getSeconds()).slice(-2); // 秒
                    resource.Information.time = hour + ':' + min + ':' + sec;

                    answer.items.kana = answer.items.kana.replace(/[ぁ-ん]/g, (s:any):string => {
                        return String.fromCharCode(s.charCodeAt(0) + 0x60);
                    });

                    resource.Information.kana = answer.items.kana;

                    resource.Information.insurance = answer.items.insurance;
                    resource.Category = answer.items.category;
                    $scope.progress = true;
                    resource.$save({}, (result:any):void => {
                        if (result) {
                            if (result.code == 0) {
                                PatientsList(PatientQuery, {}, (data:any):void => {
                                    $scope.progress = false;
                                    Global.socket.emit('server', {value: "1"});
                                    $scope.patients = data;
                                    $mdToast.show($mdToast.simple().content(result.message));
                                });
                            } else {
                                $mdToast.show($mdToast.simple().content(result.message));
                            }
                        } else {
                            $mdToast.show($mdToast.simple().content("save error"));
                        }
                    });
                }, ():void => { // Cancel
                });
        };

        $scope.$on('Login', ():void => {
            $scope.progress = true;
            PatientsList(PatientQuery, {}, (data:any):void => {
                $scope.patients = data;
                $scope.progress = false;
            });
        });

        $scope.$on('Logout', ():void => {
            $scope.patients = [];
        });

        $scope.$on('Update', ():void => {
            $scope.progress = true;
            PatientsList(PatientQuery, {}, (data:any):void => {
                $scope.patients = data;
                $scope.progress = false;
            });
        });

        Global.socket.on('client', (data:any):void => {
            if (data.value === "1") {
                $scope.progress = true;
                PatientsList(PatientQuery, {}, (data:any):void => {
                    $scope.patients = data;
                    $scope.progress = false;
                });
            }
        });
    }]);

controllers.controller('DescriptionController', ['$scope', '$mdBottomSheet', '$mdToast', 'Patient', 'PatientStatus', 'CurrentAccount', 'CurrentPatient', 'Global',
    ($scope:any, $mdBottomSheet:any, $mdToast:any, Patient:any, PatientStatus:any, CurrentAccount:any, CurrentPatient:any, Global:any):void => {
        //  Init(CurrentAccount, $scope);

        $scope.selectedIndex = 0;

        $scope.$watch('selectedIndex', function (current, old) {
            var resource:any = new Patient();
            resource.$get({id: CurrentPatient.id}, (data:any):void => {
                    if (data) {
                        if (data.code == 0) {
                            $scope.Input = [];
                            _.each<any>(data.value.Input, (value:any, index:number, array:any[]):void => {
                                if (value.type == "picture") {
                                    var canvas:any = new fabric.Canvas('schema');
                                    var hoge:string = JSON.stringify(value.value);
                                    canvas.loadFromJSON(hoge, canvas.renderAll.bind(canvas), (o:any, object:any):void => {
                                    });
                                }
                                $scope.Input.push(value);
                                $scope.Information = data.value.Information;
                            });
                        } else {
                            $mdToast.show($mdToast.simple().content(data.message));
                        }
                    } else {
                        $mdToast.show($mdToast.simple().content('patient error'));
                    }
                }
            );
        });

        var resource:any = new PatientStatus();
        resource.$get({id: CurrentPatient.id}, (result:any):void => {
            if (result) {
                if (result.code == 0) {
                    $scope.IsDone = (result.value == "Done");
                } else {
                    $mdToast.show($mdToast.simple().content(result.message));
                }
            } else {
                $mdToast.show($mdToast.simple().content("patient status error"));
            }
        });

        $scope.icon = "vertical_align_top";
        $scope.showSheet = ($event:any):void => {
            $scope.icon = "vertical_align_bottom";
            $mdBottomSheet.show({
                templateUrl: '/backend/partials/patient/sheet',
                controller: 'PatientSheetControl',
                targetEvent: $event
            }).then((clickedItem:any):void => {
                $scope.icon = "vertical_align_top";
            }, ():void => {
                $scope.icon = "vertical_align_top"
            });
        };

        $scope.done = ():void => {
            var resource:any = new Patient();
            resource.$remove({id: CurrentPatient.id}, (result:any):void => {
                if (result) {
                    $mdToast.show($mdToast.simple().content(result.message));
                } else {
                    $mdToast.show($mdToast.simple().content("remove patient error"));
                }
            });
        };

        $scope.download = (event:any):void => {
            var canvas:any = document.getElementById("schema");
            Canvas2Image.saveAsPNG(canvas);
        };

        $scope.$watch('IsDone', ():void => {
            if ($scope.IsDone != null)  // avoid initalizeation.
            {
                var resource:any = new PatientStatus();
                resource.$get({id: CurrentPatient.id}, (result:any):void => {
                    if (result) {
                        if (result.code == 0) {
                            if ($scope.IsDone == true) {
                                if (result.value != "Done") {
                                    resource.Status = "Done";
                                    resource.$update({id: CurrentPatient.id}, (result:any):void => {
                                        if (result) {
                                            if (result.code == 0) {
                                                Global.socket.emit('server', {value: "1"});
                                            }
                                            $mdToast.show($mdToast.simple().content('Status Updated.'));
                                        }
                                        else {
                                            $mdToast.show($mdToast.simple().content("status update error"));
                                        }
                                    });
                                }
                            } else {
                                if (result.value != "Accepted") {
                                    resource.Status = "Accepted";
                                    resource.$update({id: CurrentPatient.id}, (result:any):void => {
                                        if (result) {
                                            if (result.code == 0) {
                                                Global.socket.emit('server', {value: "1"});
                                            }
                                            $mdToast.show($mdToast.simple().content(result.message));
                                        }
                                        else {
                                            $mdToast.show($mdToast.simple().content("login error"));
                                        }
                                    });
                                }
                            }
                        } else {
                            $mdToast.show($mdToast.simple().content(result.message));
                        }
                    } else {
                        $mdToast.show($mdToast.simple().content("login error"));
                    }
                });
            }
        });
    }]);

controllers.controller('AccountsController', ['$scope', "$mdDialog", '$mdToast', 'Account', 'AccountQuery', 'AccountCreate', 'AccountPassword', 'CurrentAccount',
    ($scope:any, $mdDialog:any, $mdToast:any, Account:any, AccountQuery:any, AccountCreate:any, AccountPassword:any, CurrentAccount:any):void => {

        $scope.username = CurrentAccount.username;
        $scope.type = CurrentAccount.type;

        $scope.progress = true;
        List(AccountQuery, {}, (data:any):void => {
            $scope.progress = false;
            $scope.accounts = data;
        });

        $scope.showRegisterDialog = (id:any):void => {

            $mdDialog.show({
                controller: 'RegisterDialogController',
                templateUrl: '/backend/partials/account/registerdialog',
                targetEvent: id
            })
                .then((answer:any):void => {
                    var resource:any = new AccountCreate();
                    resource.username = answer.items.username;
                    resource.password = answer.items.password;
                    resource.type = answer.items.type;
                    $scope.progress = true;
                    resource.$save({}, (result:any):void => {
                        if (result) {
                            if (result.code == 0) {
                                List(AccountQuery, {}, (data:any):void => {
                                    $scope.accounts = data;
                                    $scope.progress = false;
                                });
                            }
                            $mdToast.show($mdToast.simple().content(result.message));
                        } else {
                            $mdToast.show($mdToast.simple().content('Status Updated.'));
                        }
                    });

                }, ():void => {
                });
        };

        $scope.showAccountDeleteDialog = (id:any):void => {
            $mdDialog.show({
                controller: 'AccountDeleteDialogController',
                templateUrl: '/backend/partials/account/deletedialog',
                targetEvent: id
            })
                .then((answer:any):void => {  // Answer
                    var resource:any = new Account();
                    $scope.progress = true;
                    resource.$remove({id: id}, (result:any):void => {
                        if (result) {
                            if (result.code == 0) {
                                List(AccountQuery, {}, (data:any):void => {
                                    $scope.accounts = data;
                                    $scope.progress = false;
                                });
                                $mdToast.show($mdToast.simple().content(result.message));
                            }
                        } else {
                            $mdToast.show($mdToast.simple().content('Status Updated.'));
                        }
                    });
                }, ():void => {
                });
        };

        $scope.showAccountUpdateDialog = (id:any):void => {
            var resource:any = new Account();
            resource.$get({id: id}, (data:any):void => {
                    if (data) {
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
                                .then((answer:any):void => {
                                    switch (answer.a) {
                                        case 1:
                                        {
                                            var post:any = new AccountPassword();
                                            post.password = answer.items.password;
                                            post.$update({id: id}, (result:any):void => {
                                                if (result) {
                                                    $mdToast.show($mdToast.simple().content(result.message));
                                                } else {
                                                    $mdToast.show($mdToast.simple().content('Password Updated error.'));
                                                }
                                            });
                                        }
                                        case 2:
                                        {
                                            var post:any = new Account();
                                            post.username = answer.items.username;
                                            post.type = answer.items.type;
                                            $scope.progress = true;
                                            post.$update({id: id}, (result:any):void => {
                                                if (result) {
                                                    if (result.code == 0) {
                                                        List(AccountQuery, {}, (data:any):void => {
                                                            $scope.accounts = data;
                                                            $scope.progress = false;
                                                            $mdToast.show($mdToast.simple().content(result.message));
                                                        });
                                                    } else {
                                                        $mdToast.show($mdToast.simple().content(result.message));
                                                    }
                                                } else {
                                                    $mdToast.show($mdToast.simple().content('account Updated error.'));
                                                }
                                            });
                                        }
                                    }
                                }, ():void => {
                                });
                        } else {
                            $mdToast.show($mdToast.simple().content(data.message));
                        }
                    } else {

                    }
                }
            );
        };

        $scope.$on('Login', ():void  => {
            $scope.progress = true;
            List(AccountQuery, {}, (data:any):void  => {
                $scope.accounts = data;
                $scope.progress = false;
            });
        });

        $scope.$on('Logout', ():void  => {
            $scope.accounts = [];
        });

        $scope.$on('Update', ():void  => {
            $scope.progress = true;
            List(AccountQuery, {}, (data:any):void  => {
                $scope.accounts = data;
                $scope.progress = false;
            });
        });

    }]);

controllers.controller('DepartmentsController', ['$scope','$state',"$mdDialog","$mdToast", "CurrentView","ViewCreate","View","ViewQuery",
    ($scope:any, $state:any, $mdDialog:any,$mdToast:any, CurrentView:any, ViewCreate:any, View:any, ViewQuery:any):void  => {

        $scope.progress = true;
        List(ViewQuery, {}, (data:any):void  => {
            $scope.Departments = data;
            $scope.progress = false;
        });

        $scope.showDepartmentCreateDialog = ():void => { // Register Dialog
            $mdDialog.show({
                controller: 'DepartmentCreateDialogController',
                templateUrl: '/backend/partials/edit/departmentcreatedialog',
                targetEvent: null
            })
                .then((answer:any):void => { // Answer
                    var view:any = new ViewCreate();
                    view.Name = answer.items.department;
                    view.$save({}, (result:any):void => {
                        if (result) {
                            if (result.code == 0) {
                                $scope.progress = true;
                                List(ViewQuery, {}, (data:any):void  => {
                                    $scope.Departments = data;
                                    $scope.progress = false;
                                    $mdToast.show($mdToast.simple().content(result.message));
                                });
                            } else {
                                $mdToast.show($mdToast.simple().content(result.message));
                            }
                        } else {
                            $mdToast.show($mdToast.simple().content("save error"));
                        }
                    });
                }, ():void => { // Cancel
                });
        };

        $scope.DepartmentUpdate = (id:any):void => {
            var view:any = new View();
            view.$get({id:id}, (data:any):void => {
                CurrentView.Data = data.value;
                $scope.Pages =  CurrentView.Data.Pages;
                $state.go('department');
            });
        };

        $scope.showDepartmentDeleteDialog = (id:any):void => {
            $mdDialog.show({
                controller: 'DepartmentDeleteDialogController',
                templateUrl: '/backend/partials/edit/departmentdeletedialog',
                targetEvent: id
            })
                .then((answer:any):void => {  // Answer
                    var view:any = new View();
                    $scope.progress = true;
                    view.$remove({id: id}, (result:any):void => {
                        if (result) {
                            if (result.code == 0) {
                                $scope.progress = true;
                                List(ViewQuery, {}, (data:any):void  => {
                                    $scope.Departments = data;
                                    $scope.progress = false;
                                    $mdToast.show($mdToast.simple().content(result.message));
                                });
                            } else {
                                $mdToast.show($mdToast.simple().content(result.message));
                            }
                        } else {
                            $mdToast.show($mdToast.simple().content("save error"));
                        }
                    });
                }, ():void => {
                });
        };

    }]);

controllers.controller('DepartmentEditController', ['$scope','$state',"CurrentView","View",
    ($scope:any, $state:any, CurrentView:any, View:any):void  => {

        $scope.Pages =  CurrentView.Data.Pages;

        $scope.showPageCreateDialog= ():void => {

        };

        $scope.PageUpdate= (index:number):void => {
            CurrentView.Page = index;
            $state.go('page');
        };

        $scope.showPageDeleteDialog = (index:number):void => {

        };

    }]);

controllers.controller('PageEditController', ['$scope','$state',"CurrentView","View",
    ($scope:any, $state:any, CurrentView:any, View:any):void  => {

        $scope.Page = CurrentView.Data.Pages[CurrentView.Page];

        $scope.showItemCreateDialog= ():void => {

        };


        $scope.showItemDeleteDialog = (index:number):void => {

        };

    }]);

controllers.controller('ControllpanelController', ['$scope', '$mdToast', '$mdBottomSheet', '$mdDialog', 'Config',
    ($scope:any, $mdToast:any, $mdBottomSheet:any, $mdDialog:any, Config:any):void  => {

        var resource:any = new Config();
        resource.$get({}, (result:any):void  => {
            if (result) {
                if (result.code == 0) {
                    $scope.config = result.value;
                } else {
                    $mdToast.show($mdToast.simple().content(result.message));
                }
            } else {
                $mdToast.show($mdToast.simple().content("config get error."));
            }
        });

        $scope.showNotificationDialog = ():void  => {  // Delete Dialog
            $mdDialog.show({
                controller: 'NotificationDialogController',
                templateUrl: '/backend/partials/controll/notification',
                targetEvent: ""
            })
                .then((answer:any):void  => {  // Answer
                    var resource:any = new Config();
                    resource.body = $scope.config;
                    resource.$update({}, (result:any):void => {
                        if (result.code == 0) {
                            $mdToast.show($mdToast.simple().content('Updated.'));
                        } else {
                            $mdToast.show($mdToast.simple().content(result.message));
                        }
                    });
                }, ():void  => {
                });
        };

        $scope.icon = "vertical_align_top";
        $scope.showSheet = ($event:any):void  => {
            $scope.icon = "vertical_align_bottom";
            $mdBottomSheet.show({
                templateUrl: '/backend/partials/patient/sheet',
                controller: 'PatientSheetControl',
                targetEvent: $event
            }).then((clickedItem:any):void  => {
                $scope.icon = "vertical_align_top";
            }, ():void  => {
                $scope.icon = "vertical_align_top"
            });
        };

    }]);





controllers.controller('PatientSheetControl', ['$scope', '$mdBottomSheet',
    ($scope:any, $mdBottomSheet:any):void  => {

        $scope.items = [
            {name: 'Archive', icon: 'archive'},
            {name: 'Mail', icon: 'mail'},
            {name: 'Message', icon: 'message'},
            {name: 'Copy', icon: 'content_copy'},
            {name: 'Create', icon: 'create'},
            {name: 'Inbox', icon: 'inbox'}
        ];

        $scope.ItemClick = ($index:any):void  => {
            $mdBottomSheet.hide($scope.items[$index]);
        };

    }]);

controllers.controller('LoginDialogController', ['$scope', '$mdDialog',
    ($scope:any, $mdDialog:any):void  => {

        $scope.hide = ():void => {
            $mdDialog.hide();
        };

        $scope.cancel = ():void  => {
            $mdDialog.cancel();
        };

        $scope.answer = (answer:any):void  => {
            $mdDialog.hide($scope);
        };

    }]);

controllers.controller('RegisterDialogController', ['$scope', '$mdDialog',
    ($scope:any, $mdDialog:any):void  => {

        $scope.hide = ():void  => {
            $mdDialog.hide();
        };

        $scope.cancel = ():void  => {
            $mdDialog.cancel();
        };

        $scope.answer = (answer:any):void  => {
            $mdDialog.hide($scope);
        };

    }]);

controllers.controller('AccountDeleteDialogController', ['$scope', '$mdDialog',
    ($scope:any, $mdDialog:any):void  => {

        $scope.hide = ():void  => {
            $mdDialog.hide();
        };

        $scope.cancel = ():void  => {
            $mdDialog.cancel();
        };

        $scope.answer = (answer:any):void  => {
            $mdDialog.hide($scope);
        };

    }]);

controllers.controller('AccountUpdateDialogController', ['$scope', '$mdDialog', 'items',
    ($scope:any, $mdDialog:any, items:any):void  => {

        $scope.items = items;

        $scope.hide = ():void  => {
            $mdDialog.hide();
        };

        $scope.cancel = ():void  => {
            $mdDialog.cancel();
        };

        $scope.changePassword = (answer:any):void  => {
            $scope.a = 1;
            $mdDialog.hide($scope);
        };

        $scope.answer = (answer:any):void  => {
            $scope.a = 2;
            $mdDialog.hide($scope);
        };

    }]);

controllers.controller('NotificationDialogController', ['$scope', '$mdDialog',
    ($scope:any, $mdDialog:any):void  => {

        $scope.hide = ():void  => {
            $mdDialog.hide();
        };

        $scope.cancel = ():void  => {
            $mdDialog.cancel();
        };

        $scope.answer = (answer:any):void  => {
            $mdDialog.hide($scope);
        };

    }]);

controllers.controller('PatientAcceptDialogController', ['$scope', '$mdDialog','ViewQuery',
    ($scope:any, $mdDialog:any, ViewQuery:any):void  => {

        $scope.categories = [];

        List(ViewQuery, {}, (data:any):void  => {
            _.each(data,(item, index):void => {
                $scope.categories.push(item.Name);
            });
        });

     //   _.map<any,any>(Views.Data.Data, (num:any, key:any):void  => {
     //       $scope.categories.push(key);
     //   });

        $scope.hide = ():void => {
            $mdDialog.hide();
        };

        $scope.cancel = ():void => {
            $mdDialog.cancel();
        };

        $scope.answer = (answer:any):void => {
            $mdDialog.hide($scope);
        };

    }]);

controllers.controller('DepartmentCreateDialogController', ['$scope', '$mdDialog','ViewQuery',
    ($scope:any, $mdDialog:any, ViewQuery:any):void  => {

      //  $scope.categories = [];

        /*List(ViewQuery, {}, (data:any):void  => {
            _.each(data,(item, index):void => {
                $scope.categories.push(item.Name);
            });
        });*/

        $scope.hide = ():void => {
            $mdDialog.hide();
        };

        $scope.cancel = ():void => {
            $mdDialog.cancel();
        };

        $scope.answer = (answer:any):void => {
            $mdDialog.hide($scope);
        };

    }]);

controllers.controller('DepartmentDeleteDialogController', ['$scope', '$mdDialog',
    ($scope:any, $mdDialog:any):void  => {

        $scope.hide = ():void  => {
            $mdDialog.hide();
        };

        $scope.cancel = ():void  => {
            $mdDialog.cancel();
        };

        $scope.answer = (answer:any):void  => {
            $mdDialog.hide($scope);
        };

    }]);
