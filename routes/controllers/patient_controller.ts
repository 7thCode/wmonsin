/**
 patient_controller.ts
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

var PatientModel = require('../../model/patient');

var result = require('./../lib/result');
var Wrapper = require('./../lib/wrapper');
var wrapper = new Wrapper;

var log4js = require('log4js');
log4js.configure("config/logs.json");
var logger = log4js.getLogger('request');
logger.setLevel(config.loglevel);

class PatientController {

    constructor() {
    }

    public post_patient_accept(req:any, res:any):void {
        logger.trace("begin /patient/accept");
        wrapper.Guard(req, res, (req:any, res:any):void => {
            var number:number = 1000;
            //同時に同名でないこと（自動Accept対策)
            var query = {"$and": [{'Information.name': req.body.Information.name}, {'Information.time': req.body.Information.time}]};
            wrapper.Find(res, number, PatientModel, query, {}, {}, (res:any, docs:any) => {
                if (docs.length === 0) {
                    var patient:any = new PatientModel();
                    patient.Information = req.body.Information;
                    patient.Date = new Date();
                    patient.Category = req.body.Category;
                    patient.Status = req.body.Status;
                    patient.Input = req.body.Input;
                    patient.Sequential = req.body.Sequential;
                    wrapper.Save(res, number, patient, (res:any, patient:any) => {
                        wrapper.SendResult(res, 0, "OK", patient.Status);
                        logger.trace("end /patient/accept");
                    });
                } else {
                    wrapper.SendResult(res, number + 10, "", {});
                }
            });
        });
    }

    public get_patient_id(req:any, res:any):void {
        logger.trace("begin /patient/:id");
        wrapper.Guard(req, res, (req:any, res:any) => {
            var number:number = 2000;
            wrapper.Authenticate(req, res, number, (user:any, res:any) => {
                wrapper.FindById(res, number, PatientModel, req.params.id, (res, patient) => {
                    wrapper.SendResult(res, 0, "OK", patient);
                    logger.trace("end /patient/:id");
                });
            });
        });
    }

    public put_patient_id(req:any, res:any):void {
        logger.trace("begin /patient/:id");
        wrapper.Guard(req, res, (req:any, res:any) => {
            var number:number = 3000;
            wrapper.Authenticate(req, res, number, (user:any, res:any) => {
                wrapper.FindById(res, number, PatientModel, req.params.id, (res, patient) => {
                    patient.Status = req.body.Status;
                    patient.Input = req.body.Input;
                    patient.Sequential = req.body.Sequential;
                    wrapper.Save(res, number, patient, (res:any, patient:any) => {
                        wrapper.SendResult(res, 0, "OK", patient);
                        logger.trace("end /patient/:id");
                    });
                });
            });
        });
    }

    public delete_patient_id(req:any, res:any):void {
        logger.trace("begin /patient/:id");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 4000;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                wrapper.If(res, number, (user.type != "Viewer"), (res:any):void  => {
                    wrapper.Remove(res, number, PatientModel, req.params.id, (res:any):void  => {
                        wrapper.SendResult(res, 0, "OK", {});
                        logger.trace("end /patient/:id");
                    });
                });
            });
        });
    }

    public get_patient_query_query(req:any, res:any):void {
        logger.trace("begin /patient/query/:query");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 5000;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                var query = JSON.parse(decodeURIComponent(req.params.query));
                wrapper.Find(res, number, PatientModel, query, {}, {sort: {Date: -1}}, (res:any, docs:any):void  => {
                    wrapper.SendResult(res, 0, "OK", docs);
                    logger.trace("end /patient/query/:query");
                });
            });
        });
    }

    public get_patient_count_query(req:any, res:any):void {
        logger.trace("begin /patient/count/:query");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 6000;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                var query = JSON.parse(decodeURIComponent(req.params.query));
                PatientModel.count(query, (error:any, docs:any):void => {
                    if (!error) {
                        if (docs) {
                            wrapper.SendResult(res, 0, "OK", docs);
                            logger.trace("end /patient/count/:query");
                        } else {
                            wrapper.SendResult(res, 0, "OK", 0);
                        }
                    } else {
                        wrapper.SendError(res, number + 100, error.message, error);
                    }
                });
            });
        });
    }

    public get_patient_status_id(req:any, res:any):void {
        logger.trace("begin /patient/status/:id");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 7000;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                wrapper.FindById(res, number, PatientModel, req.params.id, (res:any, patient:any):void  => {
                    wrapper.SendResult(res, 0, "OK", patient.Status);
                    logger.trace("end /patient/status/:id");
                });
            });
        });
    }

    public put_patient_status_id(req:any, res:any):void {
        logger.trace("begin /patient/status/:id");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 8000;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                wrapper.If(res, number, (user.type != "Viewer"), (res:any):void  => {
                    wrapper.FindById(res, number, PatientModel, req.params.id, (res:any, patient:any):void  => {
                        patient.Status = req.body.Status;
                        wrapper.Save(res, number, patient, (res:any, patient:any):void  => {
                            wrapper.SendResult(res, 0, "OK", patient.Status);
                            logger.trace("end /patient/status/:id");
                        });
                    });
                });
            });
        });
    }

    public put_patient_information_id(req:any, res:any):void {
        logger.trace("begin /patient/information/:id");
        wrapper.Guard(req, res, (req:any, res:any):void  => {
            var number:number = 8100;
            wrapper.Authenticate(req, res, number, (user:any, res:any):void  => {
                wrapper.If(res, number, (user.type != "Viewer"), (res:any):void  => {
                    wrapper.FindById(res, number, PatientModel, req.params.id, (res:any, patient:any):void  => {
                        patient.Information = req.body;
                        wrapper.Save(res, number, patient, (res:any, patient:any):void  => {
                            wrapper.SendResult(res, 0, "OK", patient.Information);
                            logger.trace("end /patient/information/:id");
                        });
                    });
                });
            });
        });
    }



    public get_api_key_patient_query_query(req:any, res:any):void {
        logger.trace("begin /api/:key/patient/query/:query");
        var number:number = 5000;
        wrapper.If(res, number, (config.key3 == req.params.key), (res:any):void  => {
            var query = JSON.parse(decodeURIComponent(req.params.query));
            wrapper.Find(res, number, PatientModel, query, {}, {sort: {Date: -1}}, (res:any, docs:any):void => {
                wrapper.SendResult(res, 0, "OK", docs);
                logger.trace("end /api/:key/patient/query/:query");
            });
        });
    }

}

module.exports = PatientController;