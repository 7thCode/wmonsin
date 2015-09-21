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

    constructor() {
        this.font = "public/font/ttf/ipaexg.ttf";
        this.doc = new PDFDocument;
    }

    public write(patient:any):any {

        this.doc.info['Title'] = patient.Information.name;
        this.doc.info['Author'] = 'WMONSIN';
        this.doc.info['Subject'] = patient.Information.kana;

        var x = 40;
        var y = 40;
        var t = 200;
        var h = 20;
        var xs = 3;
        var ys = 2;

        y += 20;
        this.doc.rect(x, y, t, h);
        this.doc.font(this.font).fontSize(12).text("氏名", x + xs, y + ys);
        this.doc.rect(x + t, y, t, h);
        this.doc.font(this.font).fontSize(12).text(patient.Information.kana, x + xs + t, y + ys);

        y += 20;
        this.doc.rect(x, y, t, h);
        this.doc.font(this.font).fontSize(12).text("氏名", x + xs, y + ys);
        this.doc.rect(x + t, y, t, h);
        this.doc.font(this.font).fontSize(12).text(patient.Information.name, x + xs + t, y + ys);

        y += 20;
        this.doc.rect(x, y, t, h);
        this.doc.font(this.font).fontSize(12).text("時刻", x + xs, y + ys);
        this.doc.rect(x + t, y, t, h);
        this.doc.font(this.font).fontSize(12).text(patient.Information.time, x + xs + t, y + ys);

        _.each(patient.Input, (item) => {

            switch (item.type) {
                case "text":
                    y += 20;
                    this.doc.rect(x, y, t, h);
                    this.doc.font(this.font).fontSize(12).text(item.name, x + xs, y + ys);
                    this.doc.rect(x + t, y, t, h);
                    this.doc.font(this.font).fontSize(12).text(item.value, x + xs + t, y + ys);
                    break;
                case "select":
                    y += 20;
                    this.doc.rect(x, y, t, h);
                    this.doc.font(this.font).fontSize(12).text(item.name, x + xs, y + ys);
                    this.doc.rect(x + t, y, t, h);
                    this.doc.font(this.font).fontSize(12).text(item.value, x + xs + t, y + ys);
                    break;
                case "check":
                    if (item.value) {
                        y += 20;
                        this.doc.rect(x, y, t, h);
                        this.doc.font(this.font).fontSize(12).text(item.name, x + xs, y + ys);
                        this.doc.rect(x + t, y, t, h);
                        this.doc.font(this.font).fontSize(12).text(item.value, x + xs + t, y + ys);
                    }
                    break;
                case "numeric":
                    y += 20;
                    this.doc.rect(x, y, t, h);
                    this.doc.font(this.font).fontSize(12).text(item.name, x + xs, y + ys);
                    this.doc.rect(x + t, y, t, h);
                    this.doc.font(this.font).fontSize(12).text(item.value, x + xs + t, y + ys);
                    break;
                default :
                    break;
            }

            if (y > 1000)
            {
               this.doc.addPage();
            }

        });

        this.doc.stroke();

        return this.doc;
    }

}

module.exports = FormatPDF;