describe('message-test', function () {
    beforeEach(module('TopApplication'));
    var $filter;
    beforeEach(inject(function (_$filter_) {
        $filter = _$filter_;
    }));
    it('message-test', function ($filter) {
        var message = $filter('message');
        expect(message('stuff')).toEqual('スタッフ');
    });
});
//# sourceMappingURL=message_spec.js.map