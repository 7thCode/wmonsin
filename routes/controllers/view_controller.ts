/**
 view_controller.ts
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

var ViewModel = require('../../model/view');

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

class ViewController {

    constructor() {
    }

    public post_view(req:any, res:any):void {
        logger.trace("begin /view");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 18000;
            var view:any = new ViewModel();
            var data:any = req.body.data;
            var viewdata:any = JSON.parse(data);
            view.Pages = viewdata.Pages;
            view.Name = viewdata.Name;
            wrapper.Save(res, number, view, (res:any, view:any):void  => {
                wrapper.SendResult(res, 0, "OK", view);
                logger.trace("end /view");
            });
        });
    }

    public post_view_create(req:any, res:any):void {
        logger.trace("begin /view/create");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 19000;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                wrapper.If(res, number, (user.type != "Viewer"), (res:any):void  => {
                    ViewModel.count({Name: req.body.Name}, (error:any, count:number):void => {
                        if (!error) {
                            if (count === 0) {
                                var view:any = new ViewModel();
                                view.Name = req.body.Name;
                                view.Pages = req.body.Pages;
                                wrapper.Save(res, number, view, (res:any, view:any):void  => {
                                    wrapper.SendResult(res, 0, "OK", view);
                                    logger.trace("end /view/create");
                                });
                            } else {
                                wrapper.SendResult(res, number + 1, "already", {});
                            }
                        } else {
                            wrapper.SendError(res, number + 20, error.message, error);
                        }
                    });
                });
            });
        });
    }

    public get_view_id(req:any, res:any):void {
        logger.trace("begin /view/:id");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 20000;
            wrapper.FindById(res, number, ViewModel, req.params.id, (res:any, view:any):void  => {
                wrapper.SendResult(res, 0, "OK", view);
            });
        });
    }

    public put_view_id(req:any, res:any):void {
        logger.trace("begin /view/:id");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 21000;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                wrapper.If(res, number, (user.type != "Viewer"), (res:any):void  => {
                    wrapper.FindById(res, number, ViewModel, req.params.id, (res:any, view:any):void => {
                        view.Name = req.body.Name;
                        view.Pages = req.body.Pages;
                        wrapper.Save(res, number, view, (res:any, object:any):void  => {
                            wrapper.SendResult(res, 0, "OK", view);
                            logger.trace("end /view/:id");
                        });
                    });
                });
            });
        });
    }

    public delete_view_id(req:any, res:any):void {
        logger.trace("begin /view/:id");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 22000;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                wrapper.If(res, number, (user.type != "Viewer"), (res:any):void  => {
                    wrapper.Remove(res, number, ViewModel, req.params.id, (res:any):void  => {
                        wrapper.SendResult(res, 0, "OK", {});
                        logger.trace("end /view/:id");
                    });
                });
            });
        });
    }

    public get_view_query_query(req:any, res:any):void {
        logger.trace("begin /view/:id");
        wrapper.Guard(req, res, (req:any, res:any):void => {
            var number:number = 23000;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                var query:any = JSON.parse(decodeURIComponent(req.params.query));
                wrapper.Find(res, number, ViewModel, {}, {}, {}, (res:any, views:any):void  => {
                    wrapper.SendResult(res, 0, "OK", views);
                    logger.trace("end /view/:id");
                });
            });
        });
    }

}


module.exports = ViewController;