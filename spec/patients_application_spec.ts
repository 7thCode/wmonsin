describe('Application: PatientsApplication', function() {

    beforeEach(angular.mock.module('PatientsApplication'));

    var $filter;
    beforeEach(angular.mock.inject(function(_$filter_) {
        $filter = _$filter_;
    }));


    it('status-test', function($filter) {
        var message = $filter('status');
        expect(message('Init')).toEqual('受付済み');
        expect(message('Accepted')).toEqual('問診済み');
        expect(message('Done')).toEqual('診療済み');
    });





});