/**
 tohtml.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */


'use strict';

declare function require(x: string): any;

var _ = require('lodash');

class ElementData {
    tag:string;
}

class ToHtml {

    constructor() {
    }

    public render(element:ElementData):string {

        if ("dv_tag" in element) {
            var haschild:boolean = false;
            var result:string = "<" + element["dv_tag"];

            for (var attribute in element) {
                if (attribute != "dv_tag") {
                    if (attribute != "dv_childelements") {
                        result += (" " + attribute + '="' + element[attribute] + '"');
                    }
                    else {
                        haschild = (element["dv_childelements"].length != 0);
                    }
                }
            }

            if (haschild) {
                result = result += ">";
                _.each(element["dv_childelements"], function (childelement) {
                    var child:ToHtml = new ToHtml();
                    result += child.render(childelement);
                });
                result += "</" + element["dv_tag"] + ">";
            }
            else {
                switch (element["dv_tag"]) {
                    case "link":
                        result = result += ">";
                        break;
                    case "meta":
                        result = result += ">";
                        break;
                    default:
                        result = result += "/>";
                        break;
                }
            }
        }
        else {
            if ("dv_value" in element) {
                result = element["dv_value"];
            }
        }
        return result;
    }
}

module.exports = ToHtml;