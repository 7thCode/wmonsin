/**
 AccountControllers.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

/// <reference path="../../../typings/tsd.d.ts" />

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

interface IControl {
    name: string;
    label: string;
    model: string;
    type: string;
}

interface ICheckControl extends IControl {
}

interface INumericControl extends IControl {
}

interface ITextControl extends IControl {
    items: [{name: string; message: string;}];
}

interface ISelectControl extends IControl {
    items: [{name: string; message: string;}];
}

interface IPictureControl extends IControl {
    path: string;
    height: number;
    width:  number;
}

interface IButtonControl extends IControl {
    path: string;
    validate: boolean;
    class: string;
}

interface IAccount extends angular.resource.IResource<any> {
    username: string;
    password: string;
    type: string;
    $login:any;
    $logout:any;
    $update:any;
}

interface IPatient extends angular.resource.IResource<any> {
    Input:any;
    Information:{name:string;time:string;kana:string;insurance:string;patientid:string;birthday:string;gender:string};
    Category:string;
    Sequential:number;
    Status:string;
    $update:any;
}

interface IView extends angular.resource.IResource<any> {
    Name: string;
    Pages: string;
    $update:any;
}

interface IGlobal {
    socket: any;
}

interface ICurrentPatient {
    id: any;
    name:string;
}

interface ICurrentView {
    Page:number;
    Data: any;
}

interface ICurrentAccount {
    username:string;
    type: string;
}

var controllers:angular.IModule = angular.module('AccountControllers', ["ngMaterial", "ngResource", 'ngMessages', 'ngMdIcons', 'ngAnimate', 'flow']);

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

controllers.value("CurrentQuery", {
    'query': {}
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
    ($resource:any):IAccount => {
        return $resource('/account/:id', {}, {
            get: {method: 'GET'},
            update: {method: 'PUT'},
            remove: {method: 'DELETE'}
        });
    }]);

controllers.factory('AccountPassword', ['$resource',
    ($resource:any):IAccount => {
        return $resource('/account/password/:id', {}, {
            update: {method: 'PUT'}
        });
    }]);

controllers.factory('AccountCreate', ['$resource',
    ($resource:any):IAccount => {
        return $resource('/account/create', {}, {});
    }]);

controllers.factory('PatientAccept', ['$resource',
    ($resource:any):IPatient => {
        return $resource('/patient/accept', {}, {});
    }]);

controllers.factory('PatientQuery', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/patient/query/:query', {query: '@query'}, {
            query: {method: 'GET'}
        });
    }]);

controllers.factory('PatientCount', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/patient/count/:query', {query: '@query'}, {
            query: {method: 'GET'}
        });
    }]);

controllers.factory('Patient', ['$resource',
    ($resource:any):IPatient => {
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

controllers.factory('PatientInformation', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/patient/information/:id', {}, {
            update: {method: 'PUT'}
        });
    }]);

controllers.factory('ViewCreate', ['$resource',
    ($resource:any):IView => {
        return $resource('/view/create', {}, {});
    }]);

controllers.factory('View', ['$resource',
    ($resource:any):IView => {
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

controllers.factory('File', ['$resource',
    ($resource):angular.resource.IResource<any> => {
        return $resource('/file/:name', {name: '@name'}, {
            send: {method: 'POST'},
            update: {method: 'PUT'}
        });
    }]);

controllers.factory('FileQuery', ['$resource',
    ($resource):angular.resource.IResource<any> => {
        return $resource('/file/query/:query', {query: '@query'}, {
            query: {method: 'GET'}
        });
    }]);

controllers.factory('Pdf', ['$resource',
    ($resource:any):angular.resource.IResource<any> => {
        return $resource('/pdf/:id', {}, {});
    }]);

function TodayQuery():any {
    var today:Date = new Date();
    today.setHours(23, 59, 59, 99);
    var yesterday:Date = new Date();
    yesterday.setHours(0, 0, 0, 1);
    return {$and: [{Date: {$lte: today}}, {Date: {$gt: yesterday}}]};
}

function PatientsList(resource:any, query:any, success:(value:any, headers:any) => void):void {
    resource.query({query: encodeURIComponent(JSON.stringify(query))}, (data:any, headers:any):void => {
        if (data) {
            if (data.code === 0) {
                success(data.value, headers);
            }
        }
    });
}

function List(resource:any, query:any, success:(value:any) => void):void {
    resource.query({query: encodeURIComponent(JSON.stringify(query))}, (data:any):void => {
        if (data) {
            if (data.code === 0) {
                success(data.value);
            }
        }
    });
}

/*! Controllers  */

controllers.controller("StartController", ["$scope", "$state", 'CurrentAccount',
    ($scope:any, $state:any, CurrentAccount:ICurrentAccount):void => {
        if (CurrentAccount.username !== "") {
            $scope.username = CurrentAccount.username;
            $scope.type = CurrentAccount.type;
        } else {
            $state.go('start');
        }
    }]);

controllers.controller("ApplicationController", ["$scope", "$rootScope", '$state', "$mdDialog", '$mdToast', "$mdSidenav", '$mdUtil', 'Login', 'Logout', 'CurrentAccount', 'Global',
    ($scope:any, $rootScope:any, $state:any, $mdDialog:any, $mdToast:any, $mdSidenav:any, $mdUtil:any, Login:any, Logout:any, CurrentAccount:ICurrentAccount, Global:IGlobal):void => {

        $scope.goBack = ():void => {
            window.history.back();
        };

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

        $scope.open = buildToggler();

        function buildToggler():(f:() => any, n:number) => void {
            return $mdUtil.debounce(():any => {
                $mdSidenav('nav').toggle().then(():void => {
                });
            }, 300);
         //   return debounceFn;
        }

        $scope.close = ():void => {
            $mdSidenav('nav').close().then(():void => {
            });
        };

        $scope.showLoginDialog = ():void => {
            $mdDialog.show({
                controller: 'LoginDialogController',
                templateUrl: '/backend/partials/account/logindialog',
                targetEvent: null
            }).then((account:any):void => { // Answer
                CurrentAccount.username = account.value.username;
                CurrentAccount.type = account.value.type;
                $scope.username = account.value.username;
                $scope.type = account.value.type;
                localStorage.setItem("account", JSON.stringify(CurrentAccount));
                $rootScope.$broadcast('Login');
            }, ():void => { // Error
            });
        };

        $scope.Logout = ():void => {
            var account:IAccount = new Logout();
            account.$logout((account:any):void => {
                if (account) {
                    if (account.code === 0) {
                        CurrentAccount.username = "";
                        CurrentAccount.type = "";
                        $scope.username = "";
                        $scope.type = "";
                        localStorage.removeItem("account");
                        $rootScope.$broadcast('Logout');
                        $state.go('start');
                    } else {
                        $mdToast.show($mdToast.simple().content(account.message));
                    }
                } else {
                    $mdToast.show($mdToast.simple().content("network error(logout)"));
                }
            });
        };

        if (Global.socket === null) {
            Global.socket = io.connect();
        }

        if (localStorage.getItem("account") !== null) {
            var account:any = JSON.parse(localStorage.getItem("account"));
            CurrentAccount.username = account.username;
            CurrentAccount.type = account.type;
        } else {
            $scope.showLoginDialog();
        }

        $scope.username = CurrentAccount.username;
        $scope.type = CurrentAccount.type;

        $scope.mode = "Account";

    }]);

controllers.controller('PatientsController', ['$scope', '$state', '$stateParams', '$q', "$mdDialog", '$mdBottomSheet', '$mdToast', 'Patient', 'PatientAccept', 'PatientQuery','CurrentQuery', 'PatientCount', 'CurrentAccount', 'CurrentPatient', 'Global',
    ($scope:any, $state:any, $stateParams:any, $q:any, $mdDialog:any, $mdBottomSheet:any, $mdToast:any, Patient:any, PatientAccept:any, PatientQuery:any,CurrentQuery:any, PatientCount:any, CurrentAccount:ICurrentAccount, CurrentPatient:ICurrentPatient, Global:IGlobal):void => {
        if (CurrentAccount.username !== "") {
            $scope.username = CurrentAccount.username;
            $scope.type = CurrentAccount.type;

            CurrentQuery.query = TodayQuery();
            $scope.progress = true;
            PatientsList(PatientQuery, CurrentQuery.query, (data:any):void => {
                $scope.patients = data;
                $scope.progress = false;
            });

            $scope.showPatientDescription = (id:any):void => {
                CurrentPatient.id = id;
                $stateParams.id = id;
                $state.go('description', {id: id});
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
                PatientCount.query({query: encodeURIComponent(JSON.stringify(CurrentQuery.query))}, (data:any):void => {
                    if (data) {
                        if (data.code === 0) {
                            var items:{count:number} = {count: 0};
                            items.count = data.value;

                            $mdDialog.show({
                                controller: 'PatientAcceptDialogController',
                                templateUrl: '/backend/partials/patient/patientacceptdialog',
                                targetEvent: id,
                                locals: {
                                    items: items
                                }
                            }).then((answer:any):void => { // Answer

                                var patient:IPatient = new PatientAccept();
                                patient.Input = {};
                                patient.Information = {name:"",time:"",kana:"",insurance:"", patientid:"", birthday:"", gender:""};

                                patient.Information.name = answer.items.name;

                                var now:Date = new Date();
                                var hour:string = ("0" + now.getHours()).slice(-2); // 時
                                var min:string = ("0" + now.getMinutes()).slice(-2); // 分
                                var sec:string = ("0" + now.getSeconds()).slice(-2); // 秒
                                patient.Information.time = hour + ':' + min + ':' + sec;

                                patient.Information.birthday = answer.items.birthday.toDateString();
                                patient.Information.gender = answer.items.gender;

                                answer.items.kana = answer.items.kana.replace(/[ぁ-ん]/g, (s:any):string => {
                                    return String.fromCharCode(s.charCodeAt(0) + 0x60);
                                });

                                patient.Information.kana = answer.items.kana;
                                patient.Information.insurance = answer.items.insurance;
                                patient.Category = answer.items.category;
                                patient.Sequential = items.count;
                                $scope.progress = true;
                                patient.$save({}, (result:any):void => {
                                    if (result) {
                                        if (result.code === 0) {
                                            PatientsList(PatientQuery, CurrentQuery.query, (data:any):void => {
                                                $scope.progress = false;
                                                Global.socket.emit('server', {value: "1"});
                                                $scope.patients = data;
                                            });
                                        } else {
                                            $mdToast.show($mdToast.simple().content(result.message));
                                        }
                                    } else {
                                        $mdToast.show($mdToast.simple().content("network error(save)"));
                                    }
                                });
                            }, ():void => { // Cancel
                            });
                        }
                    }
                });
            };

            $scope.querySearch = (query:any):any => {
                var deferred:any = $q.defer();
                PatientQuery.query({query: encodeURIComponent(CurrentQuery.query)}, (data:any):void => {

               //     PatientQuery.query({query: encodeURIComponent(JSON.stringify({$and: [query, {"Information.name": {$regex: querystring}}]}))}, (data:any):void => {
                    deferred.resolve(data.value);
                });
                return deferred.promise;
            };

            $scope.searchTextChange = (text:any):void => {
                if (text != "") {
                    CurrentQuery.query = {"Information.name": {$regex: text}};
                } else {
                    CurrentQuery.query = TodayQuery();
                }
                PatientsList(PatientQuery, CurrentQuery.query, (data:any):void => {
                    $scope.patients = data;
                    $scope.progress = false;
                });
            };

            $scope.selectedItemChange = (item:any):void => {
                if (item != "") {
                    CurrentQuery.query = {"Information.name": {$regex: item}};
                } else {
                    CurrentQuery.query = TodayQuery();
                }
                PatientsList(PatientQuery, CurrentQuery.query, (data:any):void => {
                    $scope.patients = data;
                    $scope.progress = false;
                });

            };

            $scope.$on('Login', ():void => {
                $scope.progress = true;
                PatientsList(PatientQuery,  CurrentQuery.query, (data:any):void => {
                    $scope.patients = data;
                    $scope.progress = false;
                });
            });

            $scope.$on('Logout', ():void => {
                CurrentAccount.username = "";
                CurrentAccount.type = "";
                $scope.patients = [];
            });

            $scope.$on('Update', ():void => {
                $scope.progress = true;
                PatientsList(PatientQuery,  CurrentQuery.query, (data:any):void => {
                    $scope.patients = data;
                    $scope.progress = false;
                });
            });

            Global.socket.on('client', (data:any):void => {
                if (data.value === "1") {
                    $scope.progress = true;
                    PatientsList(PatientQuery, CurrentQuery.query, (data:any):void => {
                        $scope.patients = data;
                        $scope.progress = false;
                    });
                }
            });

            $scope.showTotalSheet = ($event:any):void  => {
                $scope.icon = "vertical_align_bottom";
                $mdBottomSheet.show({
                    templateUrl: '/backend/partials/patient/totalsheet',
                    controller: 'PatientTotalSheetControl',
                    targetEvent: $event
                }).then((clickedItem:any):void  => {
                    $scope.icon = "vertical_align_top";
                }, ():void  => {
                    $scope.icon = "vertical_align_top"
                });
            };
        } else {
            $state.go('start');
        }
    }]);

controllers.controller('DescriptionController', ['$scope', '$mdBottomSheet', '$mdToast', 'Patient', 'PatientStatus','PatientInformation', 'CurrentAccount', 'CurrentPatient', 'Pdf', 'Global',
    ($scope:any, $mdBottomSheet:any, $mdToast:any, Patient:any, PatientStatus:any,PatientInformation:any, CurrentAccount:ICurrentAccount, CurrentPatient:ICurrentPatient, Pdf:any, Global:IGlobal):void => {
        if (CurrentPatient) {
            $scope.selectedIndex = 0;
            $scope.load = ():void => {
                var patient:IPatient = new Patient();
                patient.$get({id: CurrentPatient.id}, (data:any):void => {
                        if (data) {
                            if (data.code === 0) {
                                $scope.Input = [];
                                _.each<any>(data.value.Input, (value:any, index:any, array:any[]):void => {
                                    if (value.type === "picture") {
                                        var canvas:any = new fabric.Canvas('schema-' + value.name);
                                        canvas.loadFromJSON(JSON.stringify(value.value), canvas.renderAll.bind(canvas), (o:any, object:any):void => {
                                        });
                                    }
                                    $scope.Input.push(value);
                                });

                                var d = new Date();
                                d.setTime(Date.parse(data.value.Information.birthday));
                                $scope.birthday = d;
                                $scope.Information = data.value.Information;
                            } else {
                                $mdToast.show($mdToast.simple().content(data.message));
                            }
                        } else {
                            $mdToast.show($mdToast.simple().content('network error(patient)'));
                        }
                    }
                )
            };

            var patient:IPatient = new PatientStatus();
            patient.$get({id: CurrentPatient.id}, (result:any):void => {
                if (result) {
                    if (result.code === 0) {
                        $scope.IsDone = (result.value === "Done");
                    } else {
                        $mdToast.show($mdToast.simple().content(result.message));
                    }
                } else {
                    $mdToast.show($mdToast.simple().content("network error(status)"));
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

            $scope.setPatientID = () => {
                var patientinformation = new PatientInformation();
                patientinformation.name = $scope.Information.name;
                patientinformation.time = $scope.Information.time;
                patientinformation.kana = $scope.Information.kana;
                patientinformation.insurance = $scope.Information.insurance;
                patientinformation.patientid = $scope.Information.patientid;
                patientinformation.birthday = $scope.birthday.toDateString(); //  $scope.Information.birthday;
                patientinformation.gender = $scope.Information.gender;

                patientinformation.$update({id: CurrentPatient.id}, (result:any):void => {
                        $mdToast.show($mdToast.simple().content("OK."));
                });

            };

            $scope.done = ():void => {
                var patient:IPatient = new Patient();
                patient.$remove({id: CurrentPatient.id}, (result:any):void => {
                    if (result) {
              //          $mdToast.show($mdToast.simple().content(result.message));
                    } else {
                        $mdToast.show($mdToast.simple().content("network error(patient)"));
                    }
                });
            };

            $scope.download = (name:any):void => {
                var canvas:any = document.getElementById(name);
                Canvas2Image.saveAsPNG(canvas);
            };

            $scope.$watch('IsDone', ():void => {
                if ($scope.IsDone !== null) {// avoid initalizeation.
                    var patient:IPatient = new PatientStatus();
                    patient.$get({id: CurrentPatient.id}, (result:any):void => {
                        if (result) {
                            if (result.code === 0) {
                                if ($scope.IsDone === true) {
                                    if (result.value !== "Done") {
                                        patient.Status = "Done";
                                        patient.$update({id: CurrentPatient.id}, (result:any):void => {
                                            if (result) {
                                                if (result.code === 0) {
                                                    Global.socket.emit('server', {value: "1"});
                                                } else {
                                                    $mdToast.show($mdToast.simple().content(result.message));
                                                }
                                            } else {
                                                $mdToast.show($mdToast.simple().content("network error(status)"));
                                            }
                                        });
                                    }
                                } else {
                                    if (result.value !== "Accepted") {
                                        patient.Status = "Accepted";
                                        patient.$update({id: CurrentPatient.id}, (result:any):void => {
                                            if (result) {
                                                if (result.code === 0) {
                                                    Global.socket.emit('server', {value: "1"});
                                                } else {
                                                    $mdToast.show($mdToast.simple().content(result.message));
                                                }
                                            } else {
                                                $mdToast.show($mdToast.simple().content("network error(login)"));
                                            }
                                        });
                                    }
                                }
                            } else {
                                $mdToast.show($mdToast.simple().content(result.message));
                            }
                        } else {
                            $mdToast.show($mdToast.simple().content("network error(login)"));
                        }
                    });
                }
            });
        }
    }]);

controllers.controller('AccountsController', ['$scope', '$state', "$mdDialog", '$mdToast', 'Account', 'AccountQuery', 'AccountCreate', 'AccountPassword', 'CurrentAccount',
    ($scope:any, $state:any, $mdDialog:any, $mdToast:any, Account:any, AccountQuery:any, AccountCreate:any, AccountPassword:any, CurrentAccount:ICurrentAccount):void => {
        if (CurrentAccount.username !== "") {
            $scope.username = CurrentAccount.username;
            $scope.type = CurrentAccount.type;

            $scope.progress = true;
            List(AccountQuery, {}, (data:any):void => {
                $scope.progress = false;
                $scope.accounts = data;
            });

            $scope.showRegisterDialog = ():void => {

                $mdDialog.show({
                    controller: 'RegisterDialogController',
                    templateUrl: '/backend/partials/account/registerdialog',
                    targetEvent: null
                }).then((answer:any):void => {
                    var account:IAccount = new AccountCreate();
                    account.username = answer.items.username;
                    account.password = answer.items.password;
                    account.type = answer.items.type;
                    $scope.progress = true;
                    account.$save({}, (result:any):void => {
                        if (result) {
                            if (result.code === 0) {
                                List(AccountQuery, {}, (data:any):void => {
                                    $scope.accounts = data;
                                    $scope.progress = false;
                                });
                            } else {
                                $mdToast.show($mdToast.simple().content(result.message));
                            }
                        } else {
                            $mdToast.show($mdToast.simple().content('network error(status)'));
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
                }).then((answer:any):void => {  // Answer
                    var account:IAccount = new Account();
                    $scope.progress = true;
                    account.$remove({id: id}, (result:any):void => {
                        if (result) {
                            if (result.code === 0) {
                                List(AccountQuery, {}, (data:any):void => {
                                    $scope.accounts = data;
                                    $scope.progress = false;
                                });
                            } else {
                                $mdToast.show($mdToast.simple().content(result.message));
                            }
                        } else {
                            $mdToast.show($mdToast.simple().content('network error(status)'));
                        }
                    });
                }, ():void => {
                });
            };

            $scope.showAccountUpdateDialog = (id:any):void => {
                var account:IAccount = new Account();
                account.$get({id: id}, (data:any):void => {
                        if (data) {
                            if (data.code === 0) {
                                $scope.items = data.value;
                                $scope.items.password = "";
                                $mdDialog.show({
                                    controller: 'AccountUpdateDialogController',
                                    templateUrl: '/backend/partials/account/accountdialog',
                                    targetEvent: id,
                                    locals: {
                                        items: $scope.items
                                    }
                                }).then((answer:any):void => {
                                    switch (answer.a) {
                                        case 1:
                                        {
                                            var account:IAccount = new AccountPassword();
                                            account.password = answer.items.password;
                                            account.$update({id: id}, (result:any):void => {
                                                if (result) {
                                     //               $mdToast.show($mdToast.simple().content(result.message));
                                                } else {
                                                    $mdToast.show($mdToast.simple().content('network error(password)'));
                                                }
                                            });
                                            break;
                                        }
                                        case 2:
                                        {
                                            var account:IAccount = new Account();
                                            account.username = answer.items.username;
                                            account.type = answer.items.type;
                                            $scope.progress = true;
                                            account.$update({id: id}, (result:any):void => {
                                                if (result) {
                                                    if (result.code === 0) {
                                                        List(AccountQuery, {}, (data:any):void => {
                                                            $scope.accounts = data;
                                                            $scope.progress = false;
                                                        });
                                                    } else {
                                                        $mdToast.show($mdToast.simple().content(result.message));
                                                    }
                                                } else {
                                                    $mdToast.show($mdToast.simple().content('network error(account)'));
                                                }
                                            });
                                            break;
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

        } else {
            $state.go('start');
        }
    }]);

controllers.controller('DepartmentsController', ['$scope', '$state', "$mdDialog", "$mdToast", "CurrentView", "ViewCreate", "View", "ViewQuery",
    ($scope:any, $state:any, $mdDialog:any, $mdToast:any, CurrentView:ICurrentView, ViewCreate:any, View:any, ViewQuery:any):void  => {

        $scope.progress = true;
        List(ViewQuery, {}, (data:any):void  => {
            $scope.Departments = data;
            $scope.progress = false;
        });

        $scope.back = () => {
            window.history.back();
        };

        $scope.showDepartmentCreateDialog = ():void => { // Register Dialog
            $mdDialog.show({
                controller: 'DepartmentCreateDialogController',
                templateUrl: '/backend/partials/edit/departmentcreatedialog',
                targetEvent: null
            }).then((answer:any):void => { // Answer
                var view:IView = new ViewCreate();
                view.Name = answer.items.department;
                view.$save({}, (result:any):void => {
                    if (result) {
                        if (result.code === 0) {
                            $scope.progress = true;
                            List(ViewQuery, {}, (data:any):void  => {
                                $scope.Departments = data;
                                $scope.progress = false;
                            });
                        } else {
                            $mdToast.show($mdToast.simple().content(result.message));
                        }
                    } else {
                        $mdToast.show($mdToast.simple().content("network error(save)"));
                    }
                });
            }, ():void => { // Cancel
            });
        };

        $scope.showDepartmentCopyDialog = (id:any):void => {
            var view:IView = new View();
            view.$get({id: id}, (data:any):void => {
                $mdDialog.show({
                    controller: 'DepartmentCopyDialogController',
                    templateUrl: '/backend/partials/edit/departmentcopydialog',
                    targetEvent: null,
                    locals: {
                        items: view
                    }
                }).then((answer:any):void => { // Answer
                    var view:IView = new ViewCreate();
                    view.Pages = data.value.Pages;
                    view.Name = answer.items.department;
                    view.$save({}, (result:any):void => {
                        if (result) {
                            if (result.code === 0) {
                                $scope.progress = true;
                                List(ViewQuery, {}, (data:any):void  => {
                                    $scope.Departments = data;
                                    $scope.progress = false;
                                });
                            } else {
                                $mdToast.show($mdToast.simple().content(result.message));
                            }
                        } else {
                            $mdToast.show($mdToast.simple().content("network error(save)"));
                        }
                    });
                }, ():void => { // Cancel
                });
            });
        };

        $scope.DepartmentUpdate = (id:any):void => {
            var view:IView = new View();
            view.$get({id: id}, (data:any):void => {
                CurrentView.Data = data.value;
                $scope.Pages = CurrentView.Data.Pages;
                $state.go('department');
            });
        };

        $scope.showDepartmentDeleteDialog = (id:any):void => {
            $mdDialog.show({
                controller: 'DepartmentDeleteDialogController',
                templateUrl: '/backend/partials/edit/departmentdeletedialog',
                targetEvent: id
            }).then((answer:any):void => {  // Answer
                var view:IView = new View();
                $scope.progress = true;
                view.$remove({id: id}, (result:any):void => {
                    if (result) {
                        if (result.code === 0) {
                            $scope.progress = true;
                            List(ViewQuery, {}, (data:any):void  => {
                                $scope.Departments = data;
                                $scope.progress = false;
                            });
                        } else {
                            $mdToast.show($mdToast.simple().content(result.message));
                        }
                    } else {
                        $mdToast.show($mdToast.simple().content("network error(save)"));
                    }
                });
            }, ():void => {
            });
        };
    }]);

controllers.controller('DepartmentEditController', ['$scope', '$state', '$mdDialog', "$mdToast", "CurrentView", "View",
    ($scope:any, $state:any, $mdDialog:any, $mdToast:any, CurrentView:ICurrentView, View:any):void  => {
        if (CurrentView.Data) {

            $scope.Title = CurrentView.Data.Name;
            $scope.Pages = CurrentView.Data.Pages;

            $scope.back = () => {
                window.history.back();
            };

            $scope.up = (index:number) => {
                if (index > 0) {
                    var control:any = CurrentView.Data.Pages[index];
                    CurrentView.Data.Pages[index] = CurrentView.Data.Pages[index - 1];
                    CurrentView.Data.Pages[index - 1] = control;
                }
            };

            $scope.down = (index:number) => {
                if (index < CurrentView.Data.Pages.length - 1) {
                    var control:any = CurrentView.Data.Pages[index];
                    CurrentView.Data.Pages[index] = CurrentView.Data.Pages[index + 1];
                    CurrentView.Data.Pages[index + 1] = control;
                }
            };

            $scope.DepartmentUpdate = ():void => {
                var view:IView = new View();
                view.Name = CurrentView.Data.Name;
                view.Pages = CurrentView.Data.Pages;
                view.$update({id: CurrentView.Data._id}, (result:any):void => {
                    if (result) {
                        if (result.code === 0) {
                    //        $mdToast.show($mdToast.simple().content(result.message));
                        } else {
                            $mdToast.show($mdToast.simple().content(result.message));
                        }
                    } else {
                        $mdToast.show($mdToast.simple().content('network error(account)'));
                    }
                });
            };

            $scope.showPageCreateDialog = ():void => {
                $mdDialog.show({
                    controller: 'PageCreateDialogController',
                    templateUrl: '/backend/partials/edit/pagecreatedialog',
                    targetEvent: null
                }).then((answer:any):void => { // Answer

                    var name:string = answer.items.title;

                    var page:{headline:string; items:any; picture:any} = {
                        headline: name,
                        items: [],
                        picture: []
                    };

                    if (!CurrentView.Data.Pages) {
                        CurrentView.Data.Pages = [];
                    }
                    CurrentView.Data.Pages.push(page);
                    $scope.Pages = CurrentView.Data.Pages;

                }, ():void => { // Cancel
                });
            };

            $scope.PageUpdate = (index:number):void => {
                CurrentView.Page = index;
                $state.go('page');
            };

            $scope.showPageDeleteDialog = (index:number):void => {
                $mdDialog.show({
                    controller: 'PageDeleteDialogController',
                    templateUrl: '/backend/partials/edit/pagedeletedialog',
                    targetEvent: index
                }).then((answer:any):void => {  // Answer
                    CurrentView.Data.Pages[index] = null;
                    CurrentView.Data.Pages = _.compact(CurrentView.Data.Pages);
                    $scope.Pages = CurrentView.Data.Pages;
                }, ():void => {
                });
            };
        } else {
            $state.go('departments');
        }
    }]);

controllers.controller('PageEditController', ['$scope', '$state', '$mdDialog', '$mdToast', "CurrentView", "View",
    ($scope:any, $state:any, $mdDialog:any, $mdToast:any, CurrentView:ICurrentView, View:any):void  => {
        if (CurrentView.Data.Pages) {
            $scope.Page = CurrentView.Data.Pages[CurrentView.Page];

            $scope.back = () => {
                window.history.back();
            };

            $scope.up = (index:number):void => {
                if (index > 0) {
                    var control:any = CurrentView.Data.Pages[CurrentView.Page].items[index];
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = CurrentView.Data.Pages[CurrentView.Page].items[index - 1];
                    CurrentView.Data.Pages[CurrentView.Page].items[index - 1] = control;
                }
            };

            $scope.down = (index:number):void => {
                if (index < CurrentView.Data.Pages[CurrentView.Page].items.length - 1) {
                    var control:any = CurrentView.Data.Pages[CurrentView.Page].items[index];
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = CurrentView.Data.Pages[CurrentView.Page].items[index + 1];
                    CurrentView.Data.Pages[CurrentView.Page].items[index + 1] = control;
                }
            };

            $scope.DepartmentUpdate = ():void => {
                var view:IView = new View();
                view.Name = CurrentView.Data.Name;
                view.Pages = CurrentView.Data.Pages;
                view.$update({id: CurrentView.Data._id}, (result:any):void => {
                    if (result) {
                        if (result.code === 0) {
                //            $mdToast.show($mdToast.simple().content(result.message));
                        } else {
                            $mdToast.show($mdToast.simple().content(result.message));
                        }
                    } else {
                        $mdToast.show($mdToast.simple().content('network error(account)'));
                    }
                });
            };

            $scope.showTextCreateDialog = ():void => {
                $mdDialog.show({
                    controller: 'TextCreateDialogController',
                    templateUrl: '/backend/partials/edit/item/text/textcreatedialog',
                    targetEvent: null
                }).then((answer:any):void => { // Answer
                    var control:ITextControl = {
                        label: answer.items.label,
                        name: answer.items.name,
                        model: "",
                        type: "text",
                        items: [
                            {name: "required", message: "Required"},
                            {name: "md-maxlength", message: "Max"}
                        ]
                    };
                    CurrentView.Data.Pages[CurrentView.Page].items.push(control);
                }, ():void => { // Cancel
                });
            };

            $scope.showCheckCreateDialog = ():void => {
                $mdDialog.show({
                    controller: 'CheckCreateDialogController',
                    templateUrl: '/backend/partials/edit/item/check/checkcreatedialog',
                    targetEvent: null
                }).then((answer:any):void => { // Answer
                    var control:ICheckControl = {
                        label: answer.items.label,
                        name: answer.items.name + "-" + answer.items.label,
                        model: "",
                        type: "check"
                    };
                    CurrentView.Data.Pages[CurrentView.Page].items.push(control);
                }, ():void => { // Cancel
                });
            };

            $scope.showSelectCreateDialog = ():void => {
                $mdDialog.show({
                    controller: 'SelectCreateDialogController',
                    templateUrl: '/backend/partials/edit/item/select/selectcreatedialog',
                    targetEvent: null
                }).then((answer:any):void => { // Answer
                    var control:ISelectControl = {
                        label: answer.items.label,
                        name: answer.items.name,
                        model: "",
                        type: "select",
                        items: answer.tags
                    };
                    CurrentView.Data.Pages[CurrentView.Page].items.push(control);
                }, ():void => { // Cancel
                });
            };

            $scope.showNumericCreateDialog = ():void => {
                $mdDialog.show({
                    controller: 'NumericCreateDialogController',
                    templateUrl: '/backend/partials/edit/item/numeric/numericcreatedialog',
                    targetEvent: null
                }).then((answer:any):void => { // Answer
                    var control:INumericControl = {
                        label: answer.items.label,
                        name: answer.items.name,
                        model: "",
                        type: "numeric"
                    };
                    CurrentView.Data.Pages[CurrentView.Page].items.push(control);
                }, ():void => { // Cancel
                });
            };

            $scope.showPictureCreateDialog = ():void => {
                $mdDialog.show({
                    controller: 'PictureCreateDialogController',
                    templateUrl: '/backend/partials/edit/item/picture/picturecreatedialog',
                    targetEvent: null
                }).then((answer:any):void => { // Answer
                     CurrentView.Data.Pages[CurrentView.Page].picture[0] = {
                        height: 600,
                        width: 300,
                        path: answer.items.path,
                        type: "picture",
                        model: "",
                        name: answer.items.name,
                        label: answer.items.label
                    };
                }, ():void => { // Cancel
                });
            };

            $scope.showPictureUpdateDialog = (index:number):void => {
                var items:any = CurrentView.Data.Pages[CurrentView.Page].picture[0];
                $mdDialog.show({
                    controller: 'PictureUpdateDialogController',
                    templateUrl: '/backend/partials/edit/item/picture/pictureupdatedialog',
                    targetEvent: null,
                    locals: {
                        items: items
                    }
                }).then((answer:any):void => { // Answer
                    var control:IPictureControl = {
                        height: 600,
                        width: 300,
                        path: answer.items.path,
                        type: "picture",
                        model: "",
                        name: answer.items.name,
                        label: answer.items.label
                    };
                    CurrentView.Data.Pages[CurrentView.Page].picture[0] = control;
                }, ():void => { // Cancel
                });
            };

            $scope.showButtonCreateDialog = ():void => {

                var items:{type:string; validate:boolean; class:string} = {
                    type: "button",
                    validate: true,
                    class: "md-accent"
                };

                $mdDialog.show({
                    controller: 'ButtonCreateDialogController',
                    templateUrl: '/backend/partials/edit/item/button/buttoncreatedialog',
                    targetEvent: null,
                    locals: {
                        items: items
                    }
                }).then((answer:any):void => { // Answer

                    var path:string = "";

                    if (answer.isPage) {
                        path = "/browse/" + answer.items.page;
                    } else {
                        path = "/write";
                    }

                    var control:IButtonControl = {
                        label: answer.items.label,
                        name: answer.items.name,
                        model: "",
                        type: "button",
                        validate: answer.items.validate,
                        path: path,
                        class: answer.items.class,
                    };

                    CurrentView.Data.Pages[CurrentView.Page].items.push(control);
                }, ():void => { // Cancel
                });
            };

            $scope.showTextUpdateDialog = (index:number):void => {
                var items:any = CurrentView.Data.Pages[CurrentView.Page].items[index];
                $mdDialog.show({
                    controller: 'TextUpdateDialogController',
                    templateUrl: '/backend/partials/edit/item/check/textupdatedialog',
                    targetEvent: null,
                    locals: {
                        items: items
                    }
                }).then((answer:any):void => { // Answer
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = answer.items;
                }, ():void => { // Cancel
                });
            };

            $scope.showCheckUpdateDialog = (index:number):void => {
                var items:any = CurrentView.Data.Pages[CurrentView.Page].items[index];
                items.name = items.name.split("-")[0];
                $mdDialog.show({
                    controller: 'CheckUpdateDialogController',
                    templateUrl: '/backend/partials/edit/item/check/checkupdatedialog',
                    targetEvent: null,
                    locals: {
                        items: items
                    }
                }).then((answer:any):void => { // Answer
                    answer.items.name = answer.items.name + "-" + answer.items.label;
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = answer.items;
                }, ():void => { // Cancel
                });
            };

            $scope.showSelectUpdateDialog = (index:number):void => {
                var items:any = CurrentView.Data.Pages[CurrentView.Page].items[index];
                $mdDialog.show({
                    controller: 'SelectUpdateDialogController',
                    templateUrl: '/backend/partials/edit/item/select/selectupdatedialog',
                    targetEvent: null,
                    locals: {
                        items: items
                    }
                }).then((answer:any):void => { // Answer
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = answer.items;
                }, ():void => { // Cancel
                });
            };

            $scope.showNumericUpdateDialog = (index:number):void => {
                var items:any = CurrentView.Data.Pages[CurrentView.Page].items[index];
                $mdDialog.show({
                    controller: 'NumericUpdateDialogController',
                    templateUrl: '/backend/partials/edit/item/numeric/numericupdatedialog',
                    targetEvent: null,
                    locals: {
                        items: items
                    }
                }).then((answer:any):void => { // Answer
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = answer.items;
                }, ():void => { // Cancel
                });
            };

            $scope.showButtonUpdateDialog = (index:number):void => {
                var items:any = CurrentView.Data.Pages[CurrentView.Page].items[index];
                $mdDialog.show({
                    controller: 'ButtonUpdateDialogController',
                    templateUrl: '/backend/partials/edit/item/button/buttonupdatedialog',
                    targetEvent: null,
                    locals: {
                        items: items
                    }
                }).then((answer:any):void => { // Answer

                    var path:string = "";

                    if (answer.isPage) {
                        path = "/browse/" + answer.items.page;
                    } else {
                        path = "/write";
                    }

                    answer.items.path = path;

                    CurrentView.Data.Pages[CurrentView.Page].items[index] = answer.items;
                }, ():void => { // Cancel
                });
            };

            $scope.showTextDeleteDialog = (index:number):void => {
                $mdDialog.show({
                    controller: 'TextDeleteDialogController',
                    templateUrl: '/backend/partials/edit/item/check/textdeletedialog',
                    targetEvent: index
                }).then((answer:any):void => {  // Answer
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = null;
                    CurrentView.Data.Pages[CurrentView.Page].items = _.compact(CurrentView.Data.Pages[CurrentView.Page].items);
                }, ():void => {
                });
            };

            $scope.showCheckDeleteDialog = (index:number):void => {
                $mdDialog.show({
                    controller: 'CheckDeleteDialogController',
                    templateUrl: '/backend/partials/edit/item/check/checkdeletedialog',
                    targetEvent: index
                }).then((answer:any):void => {  // Answer
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = null;
                    CurrentView.Data.Pages[CurrentView.Page].items = _.compact(CurrentView.Data.Pages[CurrentView.Page].items);
                }, ():void => {
                });
            };

            $scope.showSelectDeleteDialog = (index:number):void => {
                $mdDialog.show({
                    controller: 'SelectDeleteDialogController',
                    templateUrl: '/backend/partials/edit/item/select/selectdeletedialog',
                    targetEvent: index
                }).then((answer:any):void => {  // Answer
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = null;
                    CurrentView.Data.Pages[CurrentView.Page].items = _.compact(CurrentView.Data.Pages[CurrentView.Page].items);
                }, ():void => {
                });
            };

            $scope.showNumericDeleteDialog = (index:number):void => {
                $mdDialog.show({
                    controller: 'NumericDeleteDialogController',
                    templateUrl: '/backend/partials/edit/item/numeric/numericdeletedialog',
                    targetEvent: index
                }).then((answer:any):void => {  // Answer
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = null;
                    CurrentView.Data.Pages[CurrentView.Page].items = _.compact(CurrentView.Data.Pages[CurrentView.Page].items);
                }, ():void => {
                });
            };

            $scope.showPictureDeleteDialog = (index:number):void => {
                $mdDialog.show({
                    controller: 'PictureDeleteDialogController',
                    templateUrl: '/backend/partials/edit/item/picture/picturedeletedialog',
                    targetEvent: index
                }).then((answer:any):void => {  // Answer
                    CurrentView.Data.Pages[CurrentView.Page].picture[0] = null;
                    CurrentView.Data.Pages[CurrentView.Page].picture = _.compact(CurrentView.Data.Pages[CurrentView.Page].picture);
                }, ():void => {
                });
            };

            $scope.showButtonDeleteDialog = (index:number):void => {
                $mdDialog.show({
                    controller: 'ButtonDeleteDialogController',
                    templateUrl: '/backend/partials/edit/item/button/buttondeletedialog',
                    targetEvent: index
                }).then((answer:any):void => {  // Answer
                    CurrentView.Data.Pages[CurrentView.Page].items[index] = null;
                    CurrentView.Data.Pages[CurrentView.Page].items = _.compact(CurrentView.Data.Pages[CurrentView.Page].items);
                }, ():void => {
                });
            };

            /*
             $scope.showItemCreateDialog = ():void => {

             $mdDialog.show({
             controller: 'ItemCreateDialogController',
             templateUrl: '/backend/partials/edit/item/itemcreatedialog',
             targetEvent: null
             })
             .then((answer:any):void => { // Answer


             //todo Item Create


             }, ():void => { // Cancel
             });

             };

             $scope.showItemUpdateDialog = (index:number):void => {

             $scope.items = $scope.Page.items[index];

             $mdDialog.show({
             controller: 'ItemUpdateDialogController',
             templateUrl: '/backend/partials/edit/item/itemupdatedialog',
             targetEvent: null,
             locals: {
             items: $scope.items
             }
             })
             .then((answer:any):void => { // Answer

             var a = answer.items;

             //todo Item Update


             }, ():void => { // Cancel
             });

             };

             $scope.showItemDeleteDialog = (index:number):void => {

             $mdDialog.show({
             controller: 'ItemDeleteDialogController',
             templateUrl: '/backend/partials/edit/item/itemdeletedialog',
             targetEvent: index
             })
             .then((answer:any):void => {  // Answer


             //todo Item Delete


             }, ():void => {
             });

             };
             */
        } else {
            $state.go('departments');
        }
    }]);

controllers.controller('FilesController', ['$scope', 'FileQuery',
    ($scope:any, FileQuery:any):void  => {
        List(FileQuery, {}, (data:any):void  => {
            $scope.files = data;
        });
    }]);

/*! Dialogs  */

controllers.controller('ControllpanelController', ['$scope', '$mdToast', '$mdBottomSheet', '$mdDialog', 'Config',
    ($scope:any, $mdToast:any, $mdBottomSheet:any, $mdDialog:any, Config:any):void  => {
        var config:any = new Config();
        config.$get({}, (result:any):void  => {
            if (result) {
                if (result.code === 0) {
                    $scope.config = result.value;
                } else {
                    $mdToast.show($mdToast.simple().content(result.message));
                }
            } else {
                $mdToast.show($mdToast.simple().content("network error(config)"));
            }
        });

        $scope.showNotificationDialog = ():void  => {  // Delete Dialog
            $mdDialog.show({
                controller: 'NotificationDialogController',
                templateUrl: '/backend/partials/controll/notification',
                targetEvent: ""
            }).then((answer:any):void  => {  // Answer
                var config:any = new Config();
                config.body = $scope.config;
                config.$update({}, (result:any):void => {
                    if (result) {
                        if (result.code === 0) {
                     //       $mdToast.show($mdToast.simple().content('Updated.'));
                        } else {
                            $mdToast.show($mdToast.simple().content(result.message));
                        }
                    } else {
                        $mdToast.show($mdToast.simple().content("network error(notification)"));
                    }

                });
            }, ():void  => {
            });
        };

        $scope.icon = "vertical_align_top";
        $scope.showConfigSheet = ($event:any):void  => {
            $scope.icon = "vertical_align_bottom";
            $mdBottomSheet.show({
                templateUrl: '/backend/partials/patient/configsheet',
                controller: 'PatientConfigSheetControl',
                targetEvent: $event
            }).then((clickedItem:any):void  => {
                $scope.icon = "vertical_align_top";
            }, ():void  => {
                $scope.icon = "vertical_align_top"
            });
        };

    }]);

controllers.controller('PatientSheetControl', ['$scope', '$mdBottomSheet', '$location', 'CurrentPatient',
    ($scope:any, $mdBottomSheet:any, $location:any, CurrentPatient:ICurrentPatient):void  => {

        if (CurrentPatient) {
            $scope.items = [
                {name: 'PDF', icon: 'content_copy'}
            ];

            $scope.ItemClick = ($index:any):void  => {
                $mdBottomSheet.hide($scope.items[$index]);
                window.open("/pdf/" + CurrentPatient.id, CurrentPatient.name, "location=no");
            };
        }
    }]);

controllers.controller('PatientTotalSheetControl', ['$scope', '$mdBottomSheet', '$location',
    ($scope:any, $mdBottomSheet:any, $location:any):void  => {

        $scope.items = [];

        $scope.ItemClick = ($index:any):void  => {
            $mdBottomSheet.hide($scope.items[$index]);
        };

    }]);

controllers.controller('PatientConfigSheetControl', ['$scope', '$mdBottomSheet', '$location',
    ($scope:any, $mdBottomSheet:any, $location:any):void  => {

        $scope.items = [];

        $scope.ItemClick = ($index:any):void  => {
            $mdBottomSheet.hide($scope.items[$index]);
        };

    }]);


controllers.controller('LoginDialogController', ['$scope', '$q', '$mdDialog', '$mdToast', 'AccountQuery', 'Login',
    ($scope:any, $q:any, $mdDialog:any, $mdToast:any, AccountQuery:any, Login:any):void  => {

        $scope.querySearch = (querystring:any):any => {
            var deferred:any = $q.defer();
            AccountQuery.query({query: encodeURIComponent(JSON.stringify({"username": {$regex: querystring}}))}, (data:any):void => {
                deferred.resolve(data.value);
            });
            return deferred.promise;
        };

        $scope.searchTextChange = (text):void => {

        };

        $scope.selectedItemChange = (item):void => {

        };

        $scope.hide = ():void => {
            $mdDialog.hide();
        };

        $scope.cancel = ():void  => {
            $mdDialog.cancel();
        };

        $scope.answer = (items:any):void  => {
            var account:IAccount = new Login();
            account.username = items.username;
            account.password = items.password;
            account.$login((account:any):void => {
                if (account) {
                    if (account.code === 0) {
                        $mdDialog.hide(account);
                    } else {
                        $mdToast.show($mdToast.simple().content(account.message));
                    }
                } else {
                    $mdToast.show($mdToast.simple().content("network error(login)"));
                }
            });
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

        $scope.iconsize = "42";
        $scope.onEnter = ():void  => {
            $scope.iconsize = "52";
        };

        $scope.onLeave = ():void  => {
            $scope.iconsize = "42";
        };

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

controllers.controller('PatientAcceptDialogController', ['$scope', '$mdDialog', 'ViewQuery', 'items',
    ($scope:any, $mdDialog:any, ViewQuery:any, items:any):void  => {

        $scope.items = items;
        $scope.categories = [];

        $scope.progress = true;
        List(ViewQuery, {}, (data:any):void  => {
            _.each(data, (item:any, index:number):void => {
                $scope.categories.push(item.Name);
            });
            $scope.progress = false;
        });

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

controllers.controller('DepartmentCreateDialogController', ['$scope', '$mdDialog', 'ViewQuery',
    ($scope:any, $mdDialog:any, ViewQuery:any):void  => {

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

controllers.controller('DepartmentCopyDialogController', ['$scope', '$mdDialog', 'ViewQuery', 'items',
    ($scope:any, $mdDialog:any, ViewQuery:any, items:any):void  => {

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

controllers.controller('PageCreateDialogController', ['$scope', '$mdDialog',
    ($scope:any, $mdDialog:any):void  => {

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

controllers.controller('PageDeleteDialogController', ['$scope', '$mdDialog',
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

controllers.controller('TextCreateDialogController', ['$scope', '$mdDialog',
    ($scope:any, $mdDialog:any):void  => {

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

controllers.controller('CheckCreateDialogController', ['$scope', '$mdDialog',
    ($scope:any, $mdDialog:any):void  => {

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

controllers.controller('SelectCreateDialogController', ['$scope', '$mdDialog',
    ($scope:any, $mdDialog:any):void  => {

        var self:any = this;
        self.tags = [];
        $scope.tags = angular.copy(self.tags);

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

controllers.controller('NumericCreateDialogController', ['$scope', '$mdDialog',
    ($scope:any, $mdDialog:any):void  => {

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

controllers.controller('PictureCreateDialogController', ['$scope', '$mdDialog', '$mdToast', 'File', 'FileQuery',
    ($scope:any, $mdDialog:any, $mdToast:any, File:any, FileQuery:any):void  => {

        $scope.items = {};

        List(FileQuery, {}, (data:any):void  => {
            $scope.files = data;
        });

        $scope.images = [];

        $scope.processFiles = (files:any):void => {

            var filename:string = files[0].name;
            List(FileQuery, {filename: filename}, (data:any):void  => {
                if (data) {
                    if (data.length == 0) {
                        $scope.items.path = filename;
                        $scope.images[0] = {};
                        var fileReader:any = new FileReader();
                        var image:any = new Image();
                        fileReader.onload = (event:any):void => {
                            var uri:any = event.target.result;
                            image.src = uri;
                            image.onload = ():void => {
                                var file:any = new File();
                                file.url = uri;
                                file.$send({name: $scope.items.path});
                                $scope.$apply();
                            };
                        };
                        fileReader.readAsDataURL(files[0].file);
                    } else {
                        $mdToast.show($mdToast.simple().content("already found."));
                    }
                } else {
                    $mdToast.show($mdToast.simple().content("network error(file)"));
                }
            });

        };

        $scope.selectFile = (filename:string):void => {
            $scope.items.path = filename;
        };

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

controllers.controller('PictureUpdateDialogController', ['$scope', '$mdDialog', 'File', 'FileQuery', 'items',
    ($scope:any, $mdDialog:any, File:any, FileQuery:any, items:any):void  => {

        $scope.items = items;

        List(FileQuery, {}, (data:any):void  => {
            $scope.files = data;
        });

        $scope.images = [];

        $scope.processFiles = (files:any):void => {

            $scope.items.path = files[0].name;
            $scope.images[0] = {};
            var fileReader = new FileReader();
            var image = new Image();
            fileReader.onload = (event:any):void => {
                var uri = event.target.result;
                image.src = uri;
                image.onload = ():void => {
                    var file = new File();
                    file.url = uri;
                    file.$send({name: $scope.items.path});
                    $scope.$apply();
                };
            };
            fileReader.readAsDataURL(files[0].file);

        };

        /*
         $scope.processFiles = (files:any):void => {
         $scope.images[0] = {};
         var fileReader = new FileReader();
         var image = new Image();
         fileReader.onload = (event:any):void => {
         var uri = event.target.result;
         image.src = uri;
         image.onload = ():void => {
         var file = new File();
         file.url = uri;
         file.$update({name: $scope.items.path});
         $scope.$apply();
         };
         };
         fileReader.readAsDataURL(files[0].file);
         };

         */

        $scope.selectFile = (filename:string):void => {
            $scope.items.path = filename;
        };

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

controllers.controller('ButtonCreateDialogController', ['$scope', '$mdDialog',
    ($scope:any, $mdDialog:any):void  => {

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

controllers.controller('CheckUpdateDialogController', ['$scope', '$mdDialog', 'items',
    ($scope:any, $mdDialog:any, items:any):void  => {

        $scope.items = items;

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

controllers.controller('SelectUpdateDialogController', ['$scope', '$mdDialog', 'items',
    ($scope:any, $mdDialog:any, items:any):void  => {

        $scope.items = items;

        //  var self = this;
        //  self.tags = [];
        //  $scope.tags = angular.copy(self.tags);

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

controllers.controller('NumericUpdateDialogController', ['$scope', '$mdDialog', 'items',
    ($scope:any, $mdDialog:any, items:any):void  => {

        $scope.items = items;

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

controllers.controller('ButtonUpdateDialogController', ['$scope', '$mdDialog', 'items',
    ($scope:any, $mdDialog:any, items:any):void  => {

        var path:string = items.path;

        $scope.items = items;

        $scope.isPage = (path != "/write");
        if ($scope.isPage) {
            var elements:string[] = path.split("/");
            if (elements.length === 3) {
                $scope.items.page = elements[2];
            }
        }

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

controllers.controller('TextDeleteDialogController', ['$scope', '$mdDialog',
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

controllers.controller('CheckDeleteDialogController', ['$scope', '$mdDialog',
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

controllers.controller('SelectDeleteDialogController', ['$scope', '$mdDialog',
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

controllers.controller('NumericDeleteDialogController', ['$scope', '$mdDialog',
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

controllers.controller('PictureDeleteDialogController', ['$scope', '$mdDialog',
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

controllers.controller('ButtonDeleteDialogController', ['$scope', '$mdDialog',
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
