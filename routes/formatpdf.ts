/**
 * Created by oda on 2015/09/21.
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
    }

    public write(patient:any):any {

        this.doc.info['Title'] = patient.Information.name;
        this.doc.info['Author'] = 'WMONSIN';
        this.doc.info['Subject'] = patient.Information.kana;

        this.originy += 20;
        this.doc.rect(this.originx, this.originy, this.nameboxwidth, this.boxhight);
        this.doc.font(this.font).fontSize(12).text("氏名", this.originx + this.stringoffsetx, this.originy + this.stringoffsety);
        this.doc.rect(this.originx + this.nameboxwidth,this.originy, this.valueboxwidth, this.boxhight);
        this.doc.font(this.font).fontSize(12).text(patient.Information.kana, this.originx + this.stringoffsetx + this.nameboxwidth, this.originy + this.stringoffsety);

        this.originy += 20;
        this.doc.rect(this.originx, this.originy, this.nameboxwidth, this.boxhight);
        this.doc.font(this.font).fontSize(12).text("かな", this.originx + this.stringoffsetx, this.originy + this.stringoffsety);
        this.doc.rect(this.originx + this.nameboxwidth, this.originy, this.valueboxwidth, this.boxhight);
        this.doc.font(this.font).fontSize(12).text(patient.Information.name, this.originx + this.stringoffsetx + this.nameboxwidth, this.originy + this.stringoffsety);

        this.originy += 20;
        this.doc.rect(this.originx, this.originy, this.nameboxwidth, this.boxhight);
        this.doc.font(this.font).fontSize(12).text("日時", this.originx + this.stringoffsetx, this.originy + this.stringoffsety);
        this.doc.rect(this.originx + this.nameboxwidth, this.originy, this.valueboxwidth, this.boxhight);
        var date = patient.Date.getFullYear() + "/" + (patient.Date.getMonth() + 1) + "/" + patient.Date.getDate()  ;
        var time = patient.Date.getHours() + ":" + patient.Date.getMinutes() + ":" + patient.Date.getSeconds();
        this.doc.font(this.font).fontSize(12).text(date + " " + time , this.originx + this.stringoffsetx + this.nameboxwidth, this.originy + this.stringoffsety);

        _.each(patient.Input, (item) => {

            switch (item.type) {
                case "text":
                    this.originy += 20;
                    this.doc.rect(this.originx, this.originy, this.nameboxwidth, this.boxhight);
                    this.doc.font(this.font).fontSize(12).text(item.name, this.originx + this.stringoffsetx, this.originy + this.stringoffsety);
                    this.doc.rect(this.originx + this.nameboxwidth, this.originy, this.valueboxwidth, this.boxhight);
                    this.doc.font(this.font).fontSize(12).text(item.value, this.originx + this.stringoffsetx + this.nameboxwidth, this.originy + this.stringoffsety);
                    break;
                case "select":
                    this.originy += 20;
                    this.doc.rect(this.originx, this.originy, this.nameboxwidth, this.boxhight);
                    this.doc.font(this.font).fontSize(12).text(item.name, this.originx + this.stringoffsetx, this.originy + this.stringoffsety);
                    this.doc.rect(this.originx + this.nameboxwidth, this.originy, this.valueboxwidth, this.boxhight);
                    this.doc.font(this.font).fontSize(12).text(item.value, this.originx + this.stringoffsetx + this.nameboxwidth, this.originy + this.stringoffsety);
                    break;
                case "check":
                    if (item.value) {
                        this.originy += 20;
                        this.doc.rect(this.originx, this.originy, this.nameboxwidth, this.boxhight);
                        this.doc.font(this.font).fontSize(12).text(item.name, this.originx + this.stringoffsetx, this.originy + this.stringoffsety);
                        this.doc.rect(this.originx + this.nameboxwidth, this.originy, this.valueboxwidth, this.boxhight);
                        this.doc.font(this.font).fontSize(12).text(item.value, this.originx + this.stringoffsetx + this.nameboxwidth, this.originy + this.stringoffsety);
                    }
                    break;
                case "numeric":
                    this.originy += 20;
                    this.doc.rect(this.originx, this.originy, this.nameboxwidth, this.boxhight);
                    this.doc.font(this.font).fontSize(12).text(item.name, this.originx + this.stringoffsetx, this.originy + this.stringoffsety);
                    this.doc.rect(this.originx + this.nameboxwidth, this.originy, this.valueboxwidth, this.boxhight);
                    this.doc.font(this.font).fontSize(12).text(item.value, this.originx + this.stringoffsetx + this.nameboxwidth, this.originy + this.stringoffsety);
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