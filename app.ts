/**
 app.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//passport

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
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

var mongoose = require('mongoose');

var fs = require('fs');
var text = fs.readFileSync('config/config.json', 'utf-8');
var config = JSON.parse(text);
config.state = app.get('env');


var MongoStore = require('connect-mongo')(session);
var options = {server: {socketOptions: {connectTimeoutMS: 1000000}}};
mongoose.connect(config.connection, options);

app.use(session({
    secret: config.key0,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 365 * 24 * 60 * 60 *1000
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

//passport
app.use(passport.initialize());
app.use(passport.session());
//passport

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

//passport
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

var Account = require('./routes/account');
passport.use(new LocalStrategy(Account.authenticate()));
//passport

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use((err:any, req:any, res:any, next:any):void => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use((err:any, req:any, res:any, next:any):void => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;