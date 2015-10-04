describe('Application: AccountApplication', function() {

    beforeEach(angular.mock.module('AccountApplication'));

    var $filter;
    beforeEach(angular.mock.inject(function(_$filter_) {
        $filter = _$filter_;
    }));

    it('rgb-test', function($filter) {
        var message = $filter('rgb');
        expect(message('Admin')).toEqual('fill:#abcdff');
        expect(message('Editor')).toEqual('fill:#abfdef');
        expect(message('Viewer')).toEqual('fill:#fbcdef');
    });

    it('status-test', function($filter) {
        var message = $filter('status');
        expect(message('Init')).toEqual('受付済み');
        expect(message('Accepted')).toEqual('問診済み');
        expect(message('Done')).toEqual('診療済み');
    });




});