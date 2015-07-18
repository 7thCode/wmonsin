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

        if ("tag" in element) {
            var haschild:boolean = false;
            var result:string = "<" + element.tag;

            for (var attribute in element) {
                if (attribute != "tag") {
                    if (attribute != "childelements") {
                        result += (" " + attribute + '="' + element[attribute] + '"');
                    }
                    else {
                        haschild = (element["childelements"].length != 0);
                    }
                }
            }

            if (haschild) {
                result = result += ">";
                _.each(element["childelements"], function (childelement) {
                    var child:ToHtml = new ToHtml();
                    result += child.render(childelement);
                });
                result += "</" + element.tag + ">";
            }
            else {
                result = result += "/>";
            }
        }
        else
        {
            if ("value" in element) {
               result = element["value"];
            }
        }
        return result;
    }
}

module.exports = ToHtml;