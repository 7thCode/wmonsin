/**
 patient.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

'use strict';

declare function require(x: string): any;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var toLocalTime = function(time) {
    var d = new Date(time);
    var offset = (new Date().getTimezoneOffset() / 60) * -1;
    var n = new Date(d.getTime() + offset);
    return n;
};

var Patient = new Schema({
    'Date': {type: Date, default: toLocalTime(Date.now)},
    'Status': {type: String, default: "Init"},
    'Category': {type: String, default: "1"},
    'Information': {},
    'Input': {},
    'Sequential': 0
});

module.exports = mongoose.model('Patient', Patient);
