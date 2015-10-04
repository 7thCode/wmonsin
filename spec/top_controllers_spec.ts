describe('Controller: TopController', function () {
    'use strict';

    var TopController, scope;

    beforeEach(module('TopApplication'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        TopController = $controller('TopController', {
            $scope : scope
        });
    }));

    it('hoge', function () {

    });
})