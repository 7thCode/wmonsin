/**
 result.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

/// <reference path="../../DefinitelyTyped/lib.d.ts"/>
/// <reference path="../../DefinitelyTyped/node/node.d.ts" />
/// <reference path="../../DefinitelyTyped/express/express.d.ts" />

class Result {
    private code:number;
    private message:string;
    private value:any;

    constructor(code:number, message:string, value:any) {
        this.code = code;
        this.message = message;
        this.value = value;
    }
}

module.exports = Result;