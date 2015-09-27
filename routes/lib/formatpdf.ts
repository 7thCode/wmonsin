/**
 formatpdf.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

'use strict';

declare function require(x:string):any;

var PDFDocument = require('pdfkit-cjk');
var _ = require('lodash');

class FormatPDF {

    private doc = null;
    private font = "";
    private pagehight = 0;
    private originx = 40;
    private originy = 40;
    private nameboxwidth = 200;
    private valueboxwidth = 300;
    private boxhight = 20;
    private stringoffsetx = 3;
    private stringoffsety = 2;

    constructor() {
        this.font = "public/font/ttf/ipaexg.ttf";
        this.doc = new PDFDocument;
        this.pagehight = 660;
        this.originx = 40;
        this.originy = 40;
        this.nameboxwidth = 200;
        this.valueboxwidth = 300;
        this.boxhight = 20;
        this.stringoffsetx = 3;
        this.stringoffsety = 2;
    }

    private TextBox(text:string, value:string):void {
        this.doc.rect(this.originx, this.originy, this.nameboxwidth, this.boxhight);
        this.doc.font(this.font).fontSize(12).text(text, this.originx + this.stringoffsetx, this.originy + this.stringoffsety);
        this.doc.rect(this.originx + this.nameboxwidth,this.originy, this.valueboxwidth, this.boxhight);
        this.doc.font(this.font).fontSize(12).text(value, this.originx + this.stringoffsetx + this.nameboxwidth, this.originy + this.stringoffsety);
    }

    public write(patient:any):any {

        this.doc.info['Title'] = patient.Information.name;
        this.doc.info['Author'] = 'WMONSIN';
        this.doc.info['Subject'] = patient.Information.kana;

        this.originy += 20;
        this.TextBox("かな",patient.Information.kana);

        this.originy += 20;
        this.TextBox("氏名",patient.Information.name);

        this.originy += 20;
        var date = patient.Date.getFullYear() + "/" + (patient.Date.getMonth() + 1) + "/" + patient.Date.getDate()  ;
        var time = patient.Date.getHours() + ":" + patient.Date.getMinutes() + ":" + patient.Date.getSeconds();
        this.TextBox("日時",date + " " + time);

        _.each(patient.Input, (item) => {

            switch (item.type) {
                case "text":
                    this.originy += 20;
                    this.TextBox(item.name,item.value);
                    break;
                case "select":
                    this.originy += 20;
                    this.TextBox(item.name,item.value);
                    break;
                case "check":
                    if (item.value) {
                        this.originy += 20;
                        this.TextBox(item.name,item.value);
                    }
                    break;
                case "numeric":
                    this.originy += 20;
                    this.TextBox(item.name,item.value);
                    break;
                default :
                    break;
            }

            if (this.originy > this.pagehight)
            {
                this.originy = 20;
                this.doc.stroke();
                this.doc.addPage();
            }

        });

        this.doc.stroke();

        return this.doc;
    }

}

module.exports = FormatPDF;