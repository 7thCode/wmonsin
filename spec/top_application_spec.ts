describe('Application: TopApplication', function() {

    beforeEach(angular.mock.module('TopApplication'));

    var $filter;
    beforeEach(angular.mock.inject(function(_$filter_) {
        $filter = _$filter_;
    }));

    it('message-test', function($filter) {
        var message = $filter('message');
        expect(message('stuff')).toEqual('スタッフ');
    });

});