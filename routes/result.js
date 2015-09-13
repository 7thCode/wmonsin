/**
 result.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */
'use strict';
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