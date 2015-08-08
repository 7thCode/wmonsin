/**
 view.js

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

var View = new Schema({
     Name: {type: String, required: true},
     Pages: {}
});

module.exports = mongoose.model('View', View);