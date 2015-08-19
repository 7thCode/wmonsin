/**
 app.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

/// <reference path="../DefinitelyTyped/lib.d.ts"/>
/// <reference path="../DefinitelyTyped/node/node.d.ts" />
/// <reference path="../DefinitelyTyped/express/express.d.ts" />
/// <reference path="../DefinitelyTyped/mongoose/mongoose.d.ts" />

'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(cookieParser());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

var mongoose = require('mongoose');

var fs = require('fs');
var text = fs.readFileSync('config/config.json', 'utf-8');
var config = JSON.parse(text);

var MongoStore = require('connect-mongo')(session);
var options = {server: {socketOptions: {connectTimeoutMS: 1000000}}};
mongoose.connect(config.connection, options);

app.use(session(
    {
        secret: config.key0,
        store: new MongoStore(
            {
                url: config.connection,
                ttl: 365 * 24 * 60 * 60
            }
        ),
        cookie: {
            httpOnly: false,
            maxAge: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000))
        }
    }));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req:any, res:any, next:any):void {
    //  var error = new Error('Not Found');
    //  error.status = 404;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Pragma", "no-cache");
    res.header("Cache-Control", "no-cache");
    res.contentType('application/json');
    res.send("code:404, message:'not found',value:{}, token:''");
    next();
});

// production error handler
// no stacktraces leaked to user
//app.use(function (err:any, req:any, res:any, next:any):void {
//   res.send(JSON.stringify(new Result(2, "create", "auth error")));
//});

module.exports = app;