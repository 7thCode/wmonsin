/**
 account.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

'use strict';

declare function require(x: string): any;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//passport
var passportLocalMongoose = require('passport-local-mongoose');
//passport

var Account = new Schema({
    username: {type: String, required: true},
    password: {type: String},
    type: String,
    key: String
});

//passport
Account.plugin(passportLocalMongoose);
//passport


module.exports = mongoose.model('Account', Account);

