'use strict';

declare function require(x:string):any;

var mongoose = require('mongoose');

var fs = require('fs');
var text = fs.readFileSync('config/config.json', 'utf-8');
var config = JSON.parse(text);

//var PatientModel = require('../../model/patient');

//var formatpdf = require('./../lib/formatpdf');

//var _ = require('lodash');

//var result = require('./../lib/result');

var Wrapper = require('./../lib/wrapper');
var wrapper = new Wrapper;

var log4js = require('log4js');
log4js.configure("config/logs.json");
var logger = log4js.getLogger('request');
logger.setLevel(config.loglevel);

class ConfigController {

    constructor() {
    }

    public get_config(req:any, res:any):void {
        logger.trace("begin /config");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 16000;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                wrapper.SendResult(res, 0, "OK", config);
                logger.trace("end /config");
            });
        });
    }

    public put_config(req:any, res:any):void {
        logger.trace("begin /config");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 17000;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                wrapper.If(res, number, (user.type != "Viewer"), (res:any):void  => {
                    config = req.body.body;
                    fs.writeFile('config/config.json', JSON.stringify(config), (error:any):void => {
                        if (!error) {
                            wrapper.SendResult(res, 0, "OK", config);
                            logger.trace("end /config");
                        } else {
                            wrapper.SendError(res, number + 1, error.message, error);
                        }
                    });
                });
            });
        });
    }


}

module.exports = ConfigController;