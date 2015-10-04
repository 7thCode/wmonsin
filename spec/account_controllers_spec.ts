describe('Controller: AccountControllers', function () {
    'use strict';

    var AccountApplication, scope;

    beforeEach(module('AccountApplication'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        AccountApplication = $controller('ApplicationController', {
            $scope : scope
        });
    }));

    it('hoge', function () {

    });
})