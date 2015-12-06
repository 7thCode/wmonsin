/**
 account_controller.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

'use strict';

declare function require(x:string):any;

var mongoose = require('mongoose');
var _ = require('lodash');

var fs = require('fs');
var text = fs.readFileSync('config/config.json', 'utf-8');
var config = JSON.parse(text);
config.dbaddress = process.env.DB_PORT_27017_TCP_ADDR || 'localhost';

var AccountModel = require('../../model/account');

var passport = require('passport');

var result = require('./../lib/result');
var Wrapper = require('./../lib/wrapper');
var wrapper = new Wrapper;

var log4js = require('log4js');
log4js.configure("config/logs.json");
var logger = log4js.getLogger('request');
logger.setLevel(config.loglevel);

var messages = {
    already:"Already found"
};

class AccountController {

    constructor() {
    }

    public post_account_create(request:any, response:any):void {
        logger.trace("begin /account/create");
        wrapper.Guard(request, response, (request:any, response:any):void  => {
            var number:number = 9000;
            wrapper.Authenticate(request, response, number, (user:any, res:any):void  => {
                wrapper.If(res, number, (user.type != "Viewer"), (res:any):void  => {
                    wrapper.FindOne(res, number, AccountModel, {username: request.body.username.toLowerCase()}, (res:any, account:any):void  => {
                        if (!account) {
                            AccountModel.register(new AccountModel({
                                    username: request.body.username,
                                    type: request.body.type
                                }),
                                request.body.password,
                                (error:any, account:any):void => {
                                    if (!error) {
                                        wrapper.SendResult(res, 0, "OK", account);
                                        logger.trace("end /account/create");
                                    } else {
                                        wrapper.SendError(response, number + 100, error.message, error);
                                    }
                                });
                        } else {
                            wrapper.SendResult(res, 1, messages.already, {});
                        }
                    });
                });
            });
        });
    }

    /*! logout */
    public post_account_logout(req:any, res:any):void {
        logger.trace("begin /account/logout");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            req.logout();
            wrapper.SendResult(res, 0, "OK", {});
            logger.trace("end /account/logout");
        });
    }

    /*! login */
    public post_account_login(request:any, response:any, next:any):void {
        passport.authenticate('local', (error:any, user:any, info:any):void  => {
            var number:number = 10000;
            try {
                if (!error) {
                    if (user) {
                        logger.trace("begin /account/login");
                        request.login(user, (error:any):void => {
                            if (!error) {
                                wrapper.SendResult(response, 0, "OK", user);
                                logger.trace("end /account/login");
                            } else {
                                wrapper.SendError(response, number + 1, error.message, error);
                            }
                        });
                    } else {
                        wrapper.SendResult(response, number + 2, "", {});
                    }
                } else {
                    wrapper.SendError(response, number + 3, error.message, error);
                }
            } catch (e) {
                wrapper.SendFatal(response, 100000, e.message, e);
            }
        })(request, response, next);
    }

    /*! get */
    public get_account_id(req:any, res:any):void {
        logger.trace("begin /account/:id");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 11000;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                wrapper.FindById(res, number, AccountModel, req.params.id, (res:any, account:any):void  => {
                    wrapper.SendResult(res, 0, "OK", account);
                    logger.trace("end /account/:id");
                });
            });
        });
    }

    /*! update */
    public put_account_id(req:any, res:any):void {
        logger.trace("begin /account/:id");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 12000;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                wrapper.If(res, number, (user.type != "Viewer"), (res:any):void  => {
                    wrapper.FindById(res, number, AccountModel, req.params.id, (res:any, account:any):void  => {
                        account.username = req.body.username;
                        account.type = req.body.type;
                        wrapper.Save(res, number, account, (res:any, account:any):void  => {
                            wrapper.SendResult(res, 0, "OK", account);
                            logger.trace("end /account/:id");
                        });
                    });
                });
            });
        });
    }

    /*! delete */
    public delete_account_id(req:any, res:any):void {
        logger.trace("begin /account/:id");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 13000;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                wrapper.If(res, number, (user.type != "Viewer"), (res:any):void  => {
                    wrapper.Remove(res, number, AccountModel, req.params.id, (res:any):void  => {
                        wrapper.SendResult(res, 0, "OK", {});
                        logger.trace("end /account/:id");
                    });
                });
            });
        });
    }

    /*! query */
    get_account_query_query(req:any, res:any):void {
        logger.trace("begin /account/query/:query");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 14000;
            // Authenticate(req, res, number, (user:any, res:any) => {
            var query:any = JSON.parse(decodeURIComponent(req.params.query));
            wrapper.Find(res, number, AccountModel, query, {}, {}, (res:any, docs:any):void  => {
                wrapper.SendResult(res, 0, "OK", wrapper.StripAccounts(docs));
                logger.trace("end /account/query/:query");
            });
            //});
        });
    }

    /*! update */
    public get_account_password_id(req:any, res:any):void {
        logger.trace("begin /account/password/:id");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 15000;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                //  If(res, number, (user.type != "Viewer"), (res:any) => {
                wrapper.FindById(res, number, AccountModel, req.params.id, (res:any, account:any):void  => {
                    account.setPassword(req.body.password, (error:any):void  => {
                        if (!error) {
                            wrapper.Save(res, number, account, (res:any, account:any):void  => {
                                wrapper.SendResult(res, 0, "OK", account);
                            });
                        } else {
                            wrapper.SendError(res, number + 200, error.message, error);
                        }
                    });
                });
                //  });
            });
        });
    }
}

module.exports = AccountController;