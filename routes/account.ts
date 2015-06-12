/**
 account.js

 Copyright (c) 2015 7ThCode.

 This software is released under the MIT License.

 http://opensource.org/licenses/mit-license.php

 */

///<reference path='../../DefinitelyTyped/node/node.d.ts'/>
///<reference path="../../DefinitelyTyped/mongodb/mongodb.d.ts" />

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//passport
//var passportLocalMongoose = require('passport-local-mongoose');
//passport
var Account = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type:String,
    key:String
});

/*Account.methods.setPassword = function (password) {

    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
};
*/
//passport
//Account.plugin(passportLocalMongoose);
//passport
module.exports = mongoose.model('Account', Account);

