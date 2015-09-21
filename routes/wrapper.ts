'use strict';

declare function require(x:string):any;

var fs = require('fs');
var text = fs.readFileSync('config/config.json', 'utf-8');
var config = JSON.parse(text);

var log4js = require('log4js');
log4js.configure("config/logs.json");
var logger = log4js.getLogger('request');
logger.setLevel(config.loglevel);

var _ = require('lodash');
var result = require('./result');

var View = require('./../model/view');

class Wrapper {

    public GetView(name:string, success:any, notfound:any, error:any):void {
        View.findOne({"Name": name}, (finderror:any, doc:any):void => {
            if (!finderror) {
                if (doc) {
                    success(doc);
                } else {
                    notfound();
                }
            } else {
                error("Find Error", finderror);
            }
        });
    }

    public BasicHeader(response:any, session:any):any {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Pragma", "no-cache");
        response.header("Cache-Control", "no-cache");
        response.contentType('application/json');
        return response;
    }

    public Guard(req:any, res:any, callback:(req:any, res:any) => void):void {
        try {
            if (req.headers["x-requested-with"] === 'XMLHttpRequest') {
                res = this.BasicHeader(res, "");
                callback(req, res);
            } else {
                this.SendWarn(res, 1, 'CSRF Attack.', {});
            }
        } catch (e) {
            this.SendFatal(res, 100000, e.message, e);
        }
    }

    public Authenticate(req:any, res:any, code:number, callback:(user:any, res:any) => void):void {
        if (req.isAuthenticated()) {
            callback(req.user, res);
        } else {
            this.SendWarn(res, code + 2, "Unacceptable", {});
        }
    }

    public FindById(res:any, code:number, model:any, id:any, callback:(res:any, object:any) => void):void {
        model.findById(id, (error:any, object:any):void => {
            if (!error) {
                if (object) {
                    callback(res, object);
                } else {
                    this.SendWarn(res, code + 10, "", {});
                }
            } else {
                this.SendError(res, code + 100, "", error);
            }
        });
    }

    public  FindOne(res:any, code:number, model:any, query:any, callback:(res:any, object:any) => void):void {
        model.findOne(query, (error:any, doc:any):void => {
            if (!error) {
                callback(res, doc);
            } else {
                this.SendError(res, code + 100, "", error);
            }
        });
    }

    public Find(res:any, code:number, model:any, query:any, count:any, sort:any, callback:(res:any, object:any) => void):void {
        model.find(query, count, sort, (error:any, docs:any):void => {
            if (!error) {
                if (docs) {
                    callback(res, docs);
                } else {
                    this.SendError(res, code + 10, "", {});
                }
            } else {
                this.SendError(res, code + 100, "", error);
            }
        });
    }

    public Save(res:any, code:number, instance:any, callback:(res:any, object:any) => void):void {
        instance.save((error:any):void => {
            if (!error) {
                callback(res, instance);
            } else {
                this.SendError(res, code + 100, "", error);
            }
        });
    }

    public Remove(res:any, code:number, model:any, id:any, callback:(res:any) => void):void {
        model.remove({_id: id}, (error:any):void => {
            if (!error) {
                callback(res);
            } else {
                this.SendError(res, code + 100, "", error);
            }
        });
    }

    public If(res:any, code:number, condition:boolean, callback:(res:any) => void):void {
        if (condition) {
            callback(res);
        } else {
            this.SendWarn(res, code + 1, "", {});
        }
    }

    public SendWarn(res:any, code:number, message:any, object:any):void {
        logger.warn(message + " " + code);
        res.send(JSON.stringify(new result(code, message, object)));
    }

    public SendError(res:any, code:number, message:any, object:any):void {
        logger.error(message + " " + code);
        res.send(JSON.stringify(new result(code, message, object)));
    }

    public SendFatal(res:any, code:number, message:any, object:any):void {
        logger.fatal(message + " " + code);
        res.send(JSON.stringify(new result(code, message, object)));
    }

    public SendResult(res:any, code:number, message:any, object:any):void {
        if (code != 0) {
            logger.info(message + " " + code);
        }
        res.send(JSON.stringify(new result(code, message, object)));
    }

    public StripAccount(account:any):any {
        delete account._id;
        delete account.hash;
        delete account.salt;
        return account;
    }

    public StripAccounts(accounts:any):any {
        var result = [];
        _.each(accounts, (member:any):void => {
            result.push(this.StripAccount(member));
        });
        return result;
    }

}

module.exports = Wrapper;



