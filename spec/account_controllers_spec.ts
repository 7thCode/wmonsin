describe('Controller: AccountControllers', function () {
    'use strict';

    var
        StartController,
        ApplicationController,
        PatientsController,
        DescriptionController,
        AccountsController,
        DepartmentsController,
        DepartmentEditController,
        PageEditController,
        FilesController,
        ControllpanelController,
        PatientSheetControl,
        PatientTotalSheetControl,
        PatientConfigSheetControl,
        LoginDialogController,
        RegisterDialogController,
        AccountDeleteDialogController,
        AccountUpdateDialogController,
        NotificationDialogController,
        PatientAcceptDialogController,
        DepartmentCreateDialogController,
        DepartmentCopyDialogController,
        DepartmentDeleteDialogController,
        PageCreateDialogController,
        PageDeleteDialogController,
        TextCreateDialogController,
        CheckCreateDialogController,
        SelectCreateDialogController,
        NumericCreateDialogController,
        PictureCreateDialogController,
        PictureUpdateDialogController,
        ButtonCreateDialogController,
        CheckUpdateDialogController,
        SelectUpdateDialogController,
        NumericUpdateDialogController,
        ButtonUpdateDialogController,
        TextDeleteDialogController,
        CheckDeleteDialogController,
        SelectDeleteDialogController,
        NumericDeleteDialogController,
        PictureDeleteDialogController,
        ButtonDeleteDialogController,
        scope,
        CurrentAccount;

    beforeEach(angular.mock.module('AccountApplication'));

    beforeEach(angular.mock.module('AccountControllers'));

    beforeEach(angular.mock.inject(function ($injector) {
        CurrentAccount = $injector.get('CurrentAccount');
    }));



    beforeEach(angular.mock.inject(function ($rootScope,$controller, $state,$stateParams, $mdDialog, $mdToast, $mdSidenav,$mdBottomSheet,$q, $mdUtil, Login, Logout,Patient,PatientAccept,PatientQuery,CurrentPatient, Global) {
        scope = $rootScope.$new();

        StartController = $controller('StartController', {$scope: scope, $state:$state, CurrentAccount:CurrentAccount});
        ApplicationController = $controller('ApplicationController', {$scope:scope, $rootScope:$rootScope, $state:$state, $mdDialog:$mdDialog, $mdToast:$mdToast, $mdSidenav:$mdSidenav, $mdUtil:$mdUtil, Login:Login, Logout:Logout, CurrentAccount:CurrentAccount, Global:Global});
        PatientsController = $controller('PatientsController', {$scope:scope, $state:$state, $stateParams:$stateParams, $q:$q, $mdDialog:$mdDialog, $mdBottomSheet:$mdBottomSheet, $mdToast:$mdToast, Patient:Patient, PatientAccept:PatientAccept, PatientQuery:PatientQuery, PatientCount:PatientQuery, CurrentAccount:CurrentAccount, CurrentPatient:CurrentPatient, Global:Global});
        DescriptionController = $controller('DescriptionController', {$scope: scope});
        AccountsController = $controller('AccountsController', {$scope: scope});
        DepartmentsController = $controller('DepartmentsController', {$scope: scope});
        DepartmentEditController = $controller('DepartmentEditController', {$scope: scope});
        PageEditController = $controller('PageEditController', {$scope: scope});
        FilesController = $controller('FilesController', {$scope: scope});
        ControllpanelController = $controller('ControllpanelController', {$scope: scope});
        PatientSheetControl = $controller('PatientSheetControl', {$scope: scope});
        PatientTotalSheetControl = $controller('PatientTotalSheetControl', {$scope: scope});
        PatientConfigSheetControl = $controller('PatientConfigSheetControl', {$scope: scope});
        LoginDialogController = $controller('LoginDialogController', {$scope: scope});
        RegisterDialogController = $controller('RegisterDialogController', {$scope: scope});
        AccountDeleteDialogController = $controller('AccountDeleteDialogController', {$scope: scope});
        AccountUpdateDialogController = $controller('AccountUpdateDialogController', {$scope: scope});
        NotificationDialogController = $controller('NotificationDialogController', {$scope: scope});
        PatientAcceptDialogController = $controller('PatientAcceptDialogController', {$scope: scope});
        DepartmentCreateDialogController = $controller('DepartmentCreateDialogController', {$scope: scope});
        DepartmentCopyDialogController = $controller('DepartmentCopyDialogController', {$scope: scope});
        DepartmentDeleteDialogController = $controller('DepartmentDeleteDialogController', {$scope: scope});
        PageCreateDialogController = $controller('PageCreateDialogController', {$scope: scope});
        PageDeleteDialogController = $controller('PageDeleteDialogController', {$scope: scope});
        TextCreateDialogController = $controller('TextCreateDialogController', {$scope: scope});
        CheckCreateDialogController = $controller('CheckCreateDialogController', {$scope: scope});
        SelectCreateDialogController = $controller('SelectCreateDialogController', {$scope: scope});
        NumericCreateDialogController = $controller('NumericCreateDialogController', {$scope: scope});
        PictureCreateDialogController = $controller('PictureCreateDialogController', {$scope: scope});
        PictureUpdateDialogController = $controller('PictureUpdateDialogController', {$scope: scope});
        ButtonCreateDialogController = $controller('ButtonCreateDialogController', {$scope: scope});
        CheckUpdateDialogController = $controller('CheckUpdateDialogController', {$scope: scope});
        SelectUpdateDialogController = $controller('SelectUpdateDialogController', {$scope: scope});
        NumericUpdateDialogController = $controller('NumericUpdateDialogController', {$scope: scope});
        ButtonUpdateDialogController = $controller('ButtonUpdateDialogController', {$scope: scope});
        TextDeleteDialogController = $controller('TextDeleteDialogController', {$scope: scope});
        CheckDeleteDialogController = $controller('CheckDeleteDialogController', {$scope: scope});
        SelectDeleteDialogController = $controller('SelectDeleteDialogController', {$scope: scope});
        NumericDeleteDialogController = $controller('NumericDeleteDialogController', {$scope: scope});
        PictureDeleteDialogController = $controller('PictureDeleteDialogController', {$scope: scope});
        ButtonDeleteDialogController = $controller('ButtonDeleteDialogController', {$scope: scope});
    }));

    it('StartController defined', function () {
        expect(StartController).toBeDefined();
    });

    it('ApplicationController defined', function () {
        expect(ApplicationController).toBeDefined();
    });

    it('PatientsController defined', function () {
        expect(PatientsController).toBeDefined();
    });

    it('DescriptionController defined', function () {
        expect(DescriptionController).toBeDefined();
    });

    it('AccountsController defined', function () {
        expect(AccountsController).toBeDefined();
    });

    it('DepartmentsController defined', function () {
        expect(DepartmentsController).toBeDefined();
    });

    it('DepartmentEditController defined', function () {
        expect(DepartmentEditController).toBeDefined();
    });

    it('PageEditController defined', function () {
        expect(PageEditController).toBeDefined();
    });

    it('FilesController defined', function () {
        expect(FilesController).toBeDefined();
    });

    it('ControllpanelController defined', function () {
        expect(ControllpanelController).toBeDefined();
    });

    it('PatientSheetControl defined', function () {
        expect(PatientSheetControl).toBeDefined();
    });

    it('PatientTotalSheetControl defined', function () {
        expect(PatientTotalSheetControl).toBeDefined();
    });

    it('PatientConfigSheetControl defined', function () {
        expect(PatientConfigSheetControl).toBeDefined();
    });

    it('LoginDialogController defined', function () {
        expect(LoginDialogController).toBeDefined();
    });

    it('RegisterDialogController defined', function () {
        expect(RegisterDialogController).toBeDefined();
    });

    it('AccountDeleteDialogController defined', function () {
        expect(AccountDeleteDialogController).toBeDefined();
    });

    it('AccountUpdateDialogController defined', function () {
        expect(AccountUpdateDialogController).toBeDefined();
    });

    it('NotificationDialogController defined', function () {
        expect(NotificationDialogController).toBeDefined();
    });

    it('PatientAcceptDialogController defined', function () {
        expect(PatientAcceptDialogController).toBeDefined();
    });

    it('DepartmentCreateDialogController defined', function () {
        expect(DepartmentCreateDialogController).toBeDefined();
    });

    it('DepartmentCopyDialogController defined', function () {
        expect(DepartmentCopyDialogController).toBeDefined();
    });

    it('DepartmentDeleteDialogController defined', function () {
        expect(DepartmentDeleteDialogController).toBeDefined();
    });

    it('PageCreateDialogController defined', function () {
        expect(PageCreateDialogController).toBeDefined();
    });

    it('PageDeleteDialogController defined', function () {
        expect(PageDeleteDialogController).toBeDefined();
    });

    it('TextCreateDialogController defined', function () {
        expect(TextCreateDialogController).toBeDefined();
    });

    it('CheckCreateDialogController defined', function () {
        expect(CheckCreateDialogController).toBeDefined();
    });

    it('SelectCreateDialogController defined', function () {
        expect(SelectCreateDialogController).toBeDefined();
    });

    it('NumericCreateDialogController defined', function () {
        expect(NumericCreateDialogController).toBeDefined();
    });

    it('PictureCreateDialogController defined', function () {
        expect(PictureCreateDialogController).toBeDefined();
    });

    it('PictureUpdateDialogController defined', function () {
        expect(PictureUpdateDialogController).toBeDefined();
    });

    it('ButtonCreateDialogController defined', function () {
        expect(ButtonCreateDialogController).toBeDefined();
    });

    it('CheckUpdateDialogController defined', function () {
        expect(CheckUpdateDialogController).toBeDefined();
    });

    it('SelectUpdateDialogController defined', function () {
        expect(SelectUpdateDialogController).toBeDefined();
    });

    it('NumericUpdateDialogController defined', function () {
        expect(NumericUpdateDialogController).toBeDefined();
    });

    it('ButtonUpdateDialogController defined', function () {
        expect(ButtonUpdateDialogController).toBeDefined();
    });

    it('TextDeleteDialogController defined', function () {
        expect(TextDeleteDialogController).toBeDefined();
    });

    it('CheckDeleteDialogController defined', function () {
        expect(CheckDeleteDialogController).toBeDefined();
    });

    it('SelectDeleteDialogController defined', function () {
        expect(SelectDeleteDialogController).toBeDefined();
    });

    it('NumericDeleteDialogController defined', function () {
        expect(NumericDeleteDialogController).toBeDefined();
    });

    it('PictureDeleteDialogController defined', function () {
        expect(PictureDeleteDialogController).toBeDefined();
    });

    it('ButtonDeleteDialogController defined', function () {
        expect(ButtonDeleteDialogController).toBeDefined();
    });

});