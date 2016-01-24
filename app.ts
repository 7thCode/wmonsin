/**
 app.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

'use strict';

declare function require(x:string):any;

function alert_log(obj:any, name:string):void {
    if (obj) {
        logger.info(name + ' Ok.');
    } else {
        logger.fatal(name + ' NG.');
    }
}

var express = require('express');
var morgan = require('morgan');
morgan.format("original", "[:date] :method :url :status :response-time ms");
var app = express();

var fs = require('fs');

var text = fs.readFileSync('config/config.json', 'utf-8');
var config = JSON.parse(text);

var log4js = require('log4js');
log4js.configure("config/logs.json");
var logger = log4js.getLogger('request');
logger.setLevel(config.loglevel);

config.dbaddress = process.env.DB_PORT_27017_TCP_ADDR || config.dbaddress;
if (config.dbaddress) {
    logger.info('config.dbaddress : ' + config.dbaddress);
} else {
    logger.fatal('config.dbaddress NG.');
}

alert_log({}, '-----------------------Invoke---------------------');

alert_log(log4js, 'log4js');
alert_log(express, 'express');
alert_log(fs, 'fs');
alert_log(config, 'config');

var path = require('path');
alert_log(path, 'path');

var favicon = require('serve-favicon');
alert_log(favicon, 'favicon');

var cookieParser = require('cookie-parser');
alert_log(cookieParser, 'cookie-parser');

var bodyParser = require('body-parser');
alert_log(bodyParser, 'body-parser');

//passport
var passport = require('passport');
alert_log(passport, 'passport');

var LocalStrategy = require('passport-local').Strategy;
alert_log(LocalStrategy, 'LocalStrategy');
//passport

var session = require('express-session');
alert_log(session, 'session');

var routes = require('./routes/index');
alert_log(routes, 'routes');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


alert_log({}, 'Jade Start.');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));


app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cookieParser());

var mongoose = require('mongoose');
alert_log(mongoose, 'mongoose');

var MongoStore = require('connect-mongo')(session);
alert_log(MongoStore, 'MongoStore');

var options = {server: {socketOptions: {connectTimeoutMS: 1000000}}};

var connection = "mongodb://" + config.dbuser + ":" + config.dbpassword + "@" + config.dbaddress + "/" + config.dbname;
mongoose.connect(connection, options);

process.on('uncaughtException', (err) => {
    logger.error('Exception.' + err);
});

process.on('exit', function (code) {
    logger.info("exit " + code);
});

process.on('SIGINT', function () {
    logger.info("SIGINT");
});

app.use(session({
    name: config.sessionName,
    secret: config.sessionkey,
    resave: false,
    rolling: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 365 * 24 * 60 * 60,
        clear_interval: 60 * 60
    })
}));

// clear_interval: 60 * 60
// ttl: 365 * 24 * 60 * 60

//passport
app.use(passport.initialize());
app.use(passport.session());
//passport


if (config.state === 'development') {
    app.use(morgan({format: 'original', immediate: true}));
} else {
    var rotatestream = require('logrotate-stream');
    app.use(morgan({
        format: 'combined',
        stream: rotatestream({file: __dirname + '/logs/access.log', size: '100k', keep: 3})
    }));
}

alert_log({}, 'Access Log');
//var csrf = require('csurf');
//app.use(csrf());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

//passport
passport.serializeUser((user, done):void => {
    done(null, user);
});

passport.deserializeUser((obj, done):void => {
    done(null, obj);
});

var Account = require('./model/account');
passport.use(new LocalStrategy(Account.authenticate()));

alert_log(Account, 'Account');

//passport.serializeUser(Account.serializeUser());
//passport.deserializeUser(Account.deserializeUser());
//passport

// catch 404 and forward to error handler
app.use((req:any, res:any, next:any):void => {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('error', {
        message: err.message + " " + req.originalUrl,
        error: err
    });
});

if (config.state === 'development') {
    app.use((err:any, req:any, res:any, next:any):void => {
        logger.fatal(err.message);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use((err:any, req:any, res:any, next:any):void => {
    logger.fatal(err.message);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;