/**
 patient.ts
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

var Patient = new Schema({
    'Date': {type: Date, default: Date.now},
    'Status': {type: String, default: "Init"},
    'Category': {type: String, default: "1"},
    'Information': {},
    'Input': {},
    'Sequential': 0
});

module.exports = mongoose.model('Patient', Patient);
