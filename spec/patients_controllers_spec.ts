describe('Controller: PatientsControllers', function () {
    'use strict';

    var AccountApplication, scope;

    beforeEach(module('AccountApplication'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        AccountApplication = $controller('BrowseController', {
            $scope : scope
        });
    }));

    it('hoge', function () {

    });
})