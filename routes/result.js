/// <reference path="../../DefinitelyTyped/lib.d.ts"/>
/// <reference path="../../DefinitelyTyped/node/node.d.ts" />
/// <reference path="../../DefinitelyTyped/express/express.d.ts" />
var Result = (function () {
    function Result(code, message, value) {
        this.code = code;
        this.message = message;
        this.value = value;
    }
    return Result;
})();
module.exports = Result;
//# sourceMappingURL=result.js.map