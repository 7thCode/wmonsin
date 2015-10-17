/**
 app.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

'use strict';

declare function require(x:string):any;

var express = require('express');
var morgan = require('morgan');
morgan.format("original", "[:date] :method :url :status :response-time ms");
var app = express();

var fs = require('fs');

var text = fs.readFileSync('config/config.json', 'utf-8');
var config = JSON.parse(text);
//config.state = app.get('env');

var log4js = require('log4js');
log4js.configure("config/logs.json");
var logger = log4js.getLogger('request');
logger.setLevel(config.loglevel);

logger.info('-----------------------Invoke---------------------');

if (log4js) {
    logger.info('log4js Ok.');
} else {
    logger.fatal('log4js NG.');
}

if (logger) {
    logger.info('logger Ok.');
} else {
    logger.fatal('logger NG.');
}

if (express) {
    logger.info('express Ok.');
} else {
    logger.fatal('express NG.');
}

if (fs) {
    logger.info('fs Ok.');
} else {
    logger.fatal('fs NG.');
}

if (config) {
    logger.info('config Ok.');
} else {
    logger.fatal('config NG.');
}

var path = require('path');
if (path) {
    logger.info('path Ok.');
} else {
    logger.fatal('path NG.');
}

var favicon = require('serve-favicon');
if (favicon) {
    logger.info('favicon Ok.');
} else {
    logger.fatal('favicon NG.');
}

var cookieParser = require('cookie-parser');
if (cookieParser) {
    logger.info('cookieParser Ok.');
} else {
    logger.fatal('cookieParser NG.');
}

var bodyParser = require('body-parser');
if (bodyParser) {
    logger.info('bodyParser Ok.');
} else {
    logger.fatal('bodyParser NG.');
}

//passport
var passport = require('passport');
if (passport) {
    logger.info('passport Ok.');
} else {
    logger.fatal('passport NG.');
}

var LocalStrategy = require('passport-local').Strategy;
if (LocalStrategy) {
    logger.info('LocalStrategy Ok.');
} else {
    logger.fatal('LocalStrategy NG.');
}
//passport

var session = require('express-session');
if (session) {
    logger.info('session Ok.');
} else {
    logger.fatal('session NG.');
}

var routes = require('./routes/index');
if (routes) {
    logger.info('routes Ok.');
} else {
    logger.fatal('routes NG.');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

logger.info('Jade Start.');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit:'50mb',extended: true }));
//app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

var mongoose = require('mongoose');
if (mongoose) {
    logger.info('mongoose Ok.');
} else {
    logger.fatal('mongoose NG.');
}

var MongoStore = require('connect-mongo')(session);
if (MongoStore) {
    logger.info('MongoStore Ok.');
} else {
    logger.fatal('MongoStore NG.');
}

var options = {server: {socketOptions: {connectTimeoutMS: 1000000}}};
mongoose.connect(config.connection, options);

process.on('exit', function (code) {
    logger.info('Stop.' + code);
});

process.on('SIGINT', function () {
    logger.info('SIGINT.');
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
    app.use(morgan({format: 'combined', stream: rotatestream({ file: __dirname + '/logs/access.log', size: '100k', keep: 3 })}));
}

logger.fatal('Access Log OK.');

//var csrf = require('csurf');
//app.use(csrf());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

//passport
//passport.serializeUser(function (user, done) {
//    done(null, user);
//});

//passport.deserializeUser(function (obj, done) {
//    done(null, obj);
//});

var Account = require('./model/account');
passport.use(new LocalStrategy(Account.authenticate()));
if (Account) {
    logger.info('Account Ok.');
} else {
    logger.fatal('Account NG.');
}

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
//passport

// catch 404 and forward to error handler
app.use((req:any, res:any, next:any):void => {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('error', {
        message: err.message,
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