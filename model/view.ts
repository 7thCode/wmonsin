/**
 view.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

'use strict';

declare function require(x: string): any;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var View = new Schema({
    Name: {type: String, required: true},
    Pages: {}
});

module.exports = mongoose.model('View', View);