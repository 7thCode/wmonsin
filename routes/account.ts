/**
 account.js

 Copyright (c) 2015 7ThCode.

 This software is released under the MIT License.

 http://opensource.org/licenses/mit-license.php

 */

/// <reference path="../../DefinitelyTyped/lib.d.ts"/>
/// <reference path="../../DefinitelyTyped/node/node.d.ts" />
/// <reference path="../../DefinitelyTyped/express/express.d.ts" />
/// <reference path="../../DefinitelyTyped/mongoose/mongoose.d.ts" />

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type:String,
    key:String
});

module.exports = mongoose.model('Account', Account);

