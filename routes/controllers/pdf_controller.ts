'use strict';

declare function require(x:string):any;

var mongoose = require('mongoose');

var fs = require('fs');
var text = fs.readFileSync('config/config.json', 'utf-8');
var config = JSON.parse(text);

var PatientModel = require('../../model/patient');

var formatpdf = require('./../lib/formatpdf');

//var _ = require('lodash');

//var result = require('./../lib/result');

//var Wrapper = require('./../lib/wrapper');
//var wrapper = new Wrapper;

var log4js = require('log4js');
log4js.configure("config/logs.json");
var logger = log4js.getLogger('request');
logger.setLevel(config.loglevel);

class PdfController {

    constructor() {
    }

    public get_pdf_id(request:any, response:any, next:any):void {
        try {
            logger.trace("begin /pdf/:id");
            PatientModel.findById(request.params.id, (error:any, patient:any):void => {
                if (!error) {
                    if (patient) {
                        var format = new formatpdf;
                        var doc = format.write(patient);
                        doc.write('public/output/output.pdf', () => {
                            var responsePDF = fs.createReadStream('public/output/output.pdf');
                            responsePDF.pipe(response);
                            logger.trace("end /pdf/:id");
                        });
                    } else {
                        logger.error("//pdf/:id 1");
                        next();
                    }
                } else {
                    logger.error("//pdf/:id 2");
                    next();
                }
            });
        } catch (e) {
            logger.error("//pdf/:id 3");
            next();
        }
    }
}

module.exports = PdfController;