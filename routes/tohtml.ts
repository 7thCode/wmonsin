/// <reference path="../../DefinitelyTyped/lib.d.ts"/>
/// <reference path="../../DefinitelyTyped/node/node.d.ts" />
/// <reference path="../../DefinitelyTyped/express/express.d.ts" />
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
                result = result += "/>";
            }
        }
        else
        {
            if ("dv_value" in element) {
               result = element["dv_value"];
            }
        }
        return result;
    }
}

module.exports = ToHtml;