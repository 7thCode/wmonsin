/// <reference path="../../DefinitelyTyped/lib.d.ts" />
/// <reference path="../../DefinitelyTyped/node/node.d.ts" />
/// <reference path="../../DefinitelyTyped/express/express.d.ts" />

declare class Result {
    private code;
    private message;
    private value;

    constructor(code:number, message:string, value:any);
}
