/**
 PatientController.js

 Copyright (c) 2015 7ThCode.

 This software is released under the MIT License.

 http://opensource.org/licenses/mit-license.php

 */

///<reference path="../../../../DefinitelyTyped/angularjs/angular.d.ts"/>
///<reference path="../../../../DefinitelyTyped/socket.io/socket.io.d.ts" />
///<reference path="../../../../DefinitelyTyped/fabricjs/fabricjs.d.ts" />
///<reference path="../../../../DefinitelyTyped/lodash/lodash.d.ts" />

'use strict';

var controllers = angular.module('PatientsControllers', ["ngMaterial", "ngResource", 'ngMessages', 'ngMdIcons']);

class Browser {
    public name:string;
    public isIE:boolean;
    public isiPhone:boolean;
    public isiPod:boolean;
    public isiPad:boolean;
    public isiOS:boolean;
    public isAndroid:boolean;
    public isPhone:boolean;
    public isTablet:boolean;
    public verArray:any;
    public ver:number;

    constructor() {

        this.name = window.navigator.userAgent.toLowerCase();

        this.isIE = (this.name.indexOf('msie') >= 0 || this.name.indexOf('trident') >= 0);
        this.isiPhone = this.name.indexOf('iphone') >= 0;
        this.isiPod = this.name.indexOf('ipod') >= 0;
        this.isiPad = this.name.indexOf('ipad') >= 0;
        this.isiOS = (this.isiPhone || this.isiPod || this.isiPad);
        this.isAndroid = this.name.indexOf('android') >= 0;
        this.isPhone = (this.isiOS || this.isAndroid);
        this.isTablet = (this.isiPad || (this.isAndroid && this.name.indexOf('mobile') < 0));

        if (this.isIE) {
            this.verArray = /(msie|rv:?)\s?([0-9]{1,})([\.0-9]{1,})/.exec(this.name);
            if (this.verArray) {
                this.ver = parseInt(this.verArray[2], 10);
            }
        }

        if (this.isiOS) {
            this.verArray = /(os)\s([0-9]{1,})([\_0-9]{1,})/.exec(this.name);
            if (this.verArray) {
                this.ver = parseInt(this.verArray[2], 10);
            }
        }

        if (this.isAndroid) {
            this.verArray = /(android)\s([0-9]{1,})([\.0-9]{1,})/.exec(this.name);
            if (this.verArray) {
                this.ver = parseInt(this.verArray[2], 10);
            }
        }
    }
}

controllers.value('Global', {
        socket: null
    }
);

controllers.value("Views", {
        Data: {
            /*    内科: [
             {
             headline: "どのような症状ですか？",
             items: [
             {label: "発熱", name: "発熱", model: "", type: "check"},
             {label: "嘔気・嘔吐", name: "嘔気・嘔吐", model: "", type: "check"},
             {label: "咳", name: "咳", model: "", type: "check"},
             {label: "食欲低下", name: "食欲低下", model: "", type: "check"},
             {label: "体重減少", name: "体重減少", model: "", type: "check"},
             {label: "下痢", name: "下痢", model: "", type: "check"},

             {label: "腹痛", name: "腹痛", model: "", type: "check"},
             {label: "胃痛", name: "胃痛", model: "", type: "check"},
             {label: "頭痛", name: "頭痛", model: "", type: "check"},
             {label: "胸痛", name: "胸痛", model: "", type: "check"},
             {label: "喘息（ぜいぜいする）", name: "喘息", model: "", type: "check"},

             {label: "息苦しい", name: "息苦しい", model: "", type: "check"},
             {label: "体のむくみ", name: "体のむくみ", model: "", type: "check"},

             {label: "その他", name: "その他", model: "", type: "check"},
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/1",
             class: "md-accent"
             }
             ]
             },

             {
             headline: "いつごろ？",
             items: [
             {
             label: "時期",
             name: "時期",
             model: "",
             type: "select",
             items: ["昨日", "１週間前", "２週間前", "１か月前", "２か月前", "半年前", "１年前", "２年前", "これ以前"]
             },
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/0",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/2",
             class: "md-accent"
             }
             ]
             },
             {
             headline: "この症状で他の医療機関（病院・診療所）を受診されましたか？",
             items: [
             {
             label: "他の医療機関",
             name: "他の医療機関",
             model: "",
             type: "select",
             items: ["いいえ", "はい"]
             },
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/1",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/3",
             class: "md-accent"
             }
             ]
             },


             {
             headline: "この症状で他の医療機関（病院・診療所）を受診されましたか？",
             items: [
             {
             label: "現在内服中の薬はありますか",
             name: "現在内服中の薬",
             model: "",
             type: "select",
             items: ["いいえ", "はい"]
             },
             {
             label: "現在内服中の薬がある場合、お薬手帳は持参していますか",
             name: "お薬手帳",
             model: "",
             type: "select",
             items: ["無し", "有り"]
             },

             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/2",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/4",
             class: "md-accent"
             }
             ]
             },

             {
             headline: "薬・注射などでアレルギー症状が出たことがありますか？",
             items: [
             {
             label: "薬・注射などでアレルギー症状が出たことがありますか？",
             name: "アレルギー症状",
             model: "",
             type: "select",
             items: ["ない", "ある"]
             },
             {
             label: "アレルギー体質といわれたことがありますか？",
             name: "アレルギー体質",
             model: "",
             type: "select",
             items: ["ない", "ある"]
             },
             {
             label: "今までに大きな病気にかかったり手術を受けたことがありますか？",
             name: "大きな病気",
             model: "",
             type: "select",
             items: ["ない", "ある"]
             },
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/3",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/5",
             class: "md-accent"
             }
             ]
             },


             {
             headline: "大きな病気・手術をされたことがある場合、どのような病気・手術をされましたか？",
             items: [
             {label: "糖尿病", name: "糖尿病", model: "", type: "check"},
             {label: "ぜんそく", name: "ぜんそく", model: "", type: "check"},
             {label: "心臓病", name: "心臓病", model: "", type: "check"},
             {label: "高血圧", name: "高血圧", model: "", type: "check"},
             {label: "肝臓病", name: "肝臓病", model: "", type: "check"},
             {label: "腎臓病", name: "腎臓病", model: "", type: "check"},

             {label: "脳梗塞", name: "脳梗塞", model: "", type: "check"},
             {label: "胃潰瘍", name: "胃潰瘍", model: "", type: "check"},
             {label: "緑内障", name: "緑内障", model: "", type: "check"},

             {label: "その他", name: "その他", model: "", type: "check"},
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/4",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/6",
             class: "md-accent"
             }
             ]
             },

             {
             headline: "タバコを吸いますか？",
             items: [
             {
             label: "タバコを吸いますか？",
             name: "タバコ",
             model: "",
             type: "select",
             items: ["吸う", "禁煙した", "吸わない"]
             },

             {label: "タバコを吸う場合、１日平均何本吸いますか？", name: "タバコ本数", model: "", type: "numeric"},


             {
             label: "禁煙した場合、いつから禁煙しましたか？",
             name: "禁煙した場合",
             model: "",
             type: "select",
             items: ["１週間前", "１か月前", "２か月前", "半年前", "１年前", "２年前", "これ以前"]
             },
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/5",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/7",
             class: "md-accent"
             }
             ]
             },


             {
             headline: "お酒を飲みますか？",
             items: [
             {
             label: "お酒を飲みますか？",
             name: "お酒",
             model: "",
             type: "select",
             items: ["飲む", "禁酒した", "飲まない"]
             },

             {
             label: "お酒を飲む場合、週に何回飲みますか？",
             name: "お酒を飲む場合",
             model: "",
             type: "select",
             items: ["１回", "２回", "３回", "４回", "５回", "６回", "毎日"]
             },

             {
             label: "お酒を飲む場合、１日にどのくらい飲みますか？",
             name: "１日にどのくらい飲む",
             model: "",
             type: "select",
             items: ["缶ビール 350ml 1本", "缶ビール 350ml 2本", "缶ビール 500ml 1本", "缶ビール 500ml 2本", "瓶ビール 大瓶633ml 1本", "日本酒 １合180ml", "日本酒　２合360ml", "これ以上"]
             },

             {
             label: "禁酒した場合、いつから禁酒しましたか？",
             name: "禁酒した場合",
             model: "",
             type: "select",
             items: ["１週間前", "１か月前", "２か月前", "半年前", "１年前", "２年前", "これ以前"]
             },

             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/6",
             class: "md-primary"
             },
             {
             label: "女性",
             name: "女性",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/8",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/write",
             class: "md-accent"
             }
             ]
             },

             {
             headline: "女性の方のみごご回答ください",
             items: [
             {
             label: "女性の方のみごご回答ください",
             name: "タバコ",
             model: "",
             type: "select",
             items: ["妊娠している", "妊娠していない", "妊娠の可能性がある"]
             },

             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/7",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/write",
             class: "md-accent"
             }
             ]
             }
             ],
             外科: [
             {
             headline: "お名前？",
             items: [
             {
             label: "お名前", name: "お名前", model: "", type: "text", items: [
             {name: "required", message: "Required"},
             {name: "md-maxlength", message: "Max"}]
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/1",
             class: "md-primary"
             }
             ]
             },
             {
             headline: "お歳は？",
             items: [
             {
             label: "お歳", name: "お歳", model: "", type: "text", items: [
             {name: "required", message: "Required"},
             {name: "md-maxlength", message: "Max"}]
             },
             {label: "その他", name: "その他", model: "", type: "text", items: []},
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/0",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/2",
             class: "md-accent"
             }
             ]
             },
             {
             headline: "痛いところは？",
             items: [
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/1",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/3",
             class: "md-accent"
             }
             ],
             picture: [
             {
             label: "",
             name: "痛いところ",
             model: "",
             type: "picture",
             path: 'images/schema.png',
             width: 300,
             height: 600
             }
             ]
             },
             {
             headline: "その症状はいつからですか？",
             items: [
             {label: "その症状はいつからですか", name: "いつからですか", model: "", type: "text", items: []},
             {label: "現在、治療中の病気がありますか", name: "治療中の病気", model: "", type: "check"},
             {label: "その他", name: "その他", model: "", type: "text", items: []},
             {label: "職業", name: "職業", model: "", type: "text", items: []},
             {label: "仕事の内容", name: "仕事の内容", model: "", type: "text", items: []},
             {label: "スポーツ歴", name: "スポーツ歴", model: "", type: "text", items: []},
             {label: "年数", name: "年数", model: "", type: "text", items: []},
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/3",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/5",
             class: "md-accent"
             }
             ]
             },
             {
             headline: "治療中の病気がありますか？",
             items: [
             {label: "現在、治療中の病気がありますか", name: "治療中の病気", model: "", type: "check"},
             {
             label: "症状", name: "症状", model: "", type: "select", items: ["糖尿病",
             "ぜんそく",
             "心臓病",
             "高血圧",
             "肝臓病",
             "腎臓病"]
             },
             {label: "その他", name: "その他", model: "", type: "text", items: []},
             {
             label: "戻る",
             name: "戻る",
             model: "",
             validate: false,
             type: "button",
             path: "/browse/4",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             validate: true,
             type: "button",
             path: "/browse/6",
             class: "md-accent"
             }
             ]
             },
             {
             headline: "普段飲んでいる薬はありますか？",
             items: [
             {label: "普段飲んでいる薬はありますか", name: "普段飲んでいる薬", model: "", type: "check"},
             {
             label: "症状", name: "症状", model: "", type: "select", items: ["心臓の薬",
             "血をかたまりにくくする薬",
             "その他"]
             },

             {label: "その他", name: "その他", model: "", type: "text", items: []},
             {label: "今までに大きな病気にかかったり手術を受けたことがありますか", name: "大きな病気", model: "", type: "check"},
             {label: "薬・注射　などでアレルギー症状が出たことがありますか", name: "アレルギー", model: "", type: "check"},
             {label: "アレルギー体質といわれたことがありますか", name: "アレルギー体質", model: "", type: "check"},
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/5",
             class: "md-primary"
             },
             {
             label: "女性",
             name: "女性",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/7",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/8",
             class: "md-accent"
             }
             ]
             },
             {
             headline: "現在妊娠中ですか？",
             items: [
             {label: "現在妊娠中ですか", name: "妊娠中", model: "", type: "check"},
             {label: "現在授乳中ですか", name: "授乳中", model: "", type: "check"},
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/6",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/9",
             class: "md-accent"
             }
             ]
             },
             {
             headline: "thanks",
             items: [
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/6",
             class: "md-primary"
             },
             {
             label: "終わり",
             name: "終わり",
             model: "",
             type: "button",
             validate: true,
             path: "/write",
             class: "md-accent"
             }
             ]
             },
             {
             headline: "thanks",
             items: [
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/7",
             class: "md-primary"
             },
             {
             label: "終わり",
             name: "終わり",
             model: "",
             type: "button",
             validate: true,
             path: "/write",
             class: "md-accent"
             }
             ]
             }
             ],
             整形外科: [
             {
             headline: "身長を入力して下さい",
             items: [
             {label: "身長を入力して下さい", name: "身長", model: "", type: "numeric"},
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/1",
             class: "md-primary"
             }
             ]
             },
             {
             headline: "体重を入力して下さい",
             items: [
             {label: "体重を入力して下さい", name: "体重", model: "", type: "numeric"},
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/0",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/2",
             class: "md-primary"
             }
             ]
             },
             {
             headline: "どうされましたか？",
             items: [
             {label: "動作時に痛みがある", name: "動作時に痛みがある", model: "", type: "check"},
             {label: "じっとしていても痛みがある", name: "じっとしていても痛みがある", model: "", type: "check"},
             {label: "しびれがある", name: "しびれがある", model: "", type: "check"},
             {label: "はれている", name: "はれている", model: "", type: "check"},
             {label: "できものがある", name: "できものがある", model: "", type: "check"},
             {label: "熱感がある", name: "熱感がある", model: "", type: "check"},
             {label: "その他", name: "その他", model: "", type: "check"},
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/1",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/3",
             class: "md-accent"
             }
             ]
             },

             {
             headline: "診て欲しいところをタッチして下さい",
             items: [
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/2",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/4",
             class: "md-accent"
             },
             ],
             picture: [
             {
             label: "",
             name: "痛いところ",
             model: "",
             type: "picture",
             path: 'images/schema.png',
             width: 300,
             height: 600
             }
             ]
             },
             {
             headline: "いつごろ？",
             items: [
             {
             label: "時期",
             name: "時期",
             model: "",
             type: "select",
             items: ["２年前", "１年前", "半年前", "２か月前", "１か月前", "２週間前", "１週間前", "昨日"]
             },
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/3",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/5",
             class: "md-accent"
             }
             ]
             },
             {
             headline: "考えられる原因はありますか？",
             items: [
             {label: "交通事故", name: "交通事故", model: "", type: "check"},
             {label: "仕事中の負傷（労災）", name: "仕事中の負傷（労災）", model: "", type: "check"},
             {label: "仕事中の負傷（公災）", name: "仕事中の負傷（公災）", model: "", type: "check"},
             {label: "スポーツ", name: "スポーツ", model: "", type: "check"},
             {label: "転倒", name: "転倒", model: "", type: "check"},
             {label: "その他", name: "その他", model: "", type: "check"},
             {label: "特に原因なし", name: "特に原因なし", model: "", type: "check"},
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/4",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/6",
             class: "md-accent"
             }

             ]
             },
             {
             headline: "職業を選択して下さい",
             items: [
             {
             label: "職業を選択して下さい",
             name: "職業",
             model: "",
             type: "select",
             items: ["会社員", "自営業", "公務員", "芸術家", "その他", "無職"]
             },
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/5",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/7",
             class: "md-accent"
             }
             ]
             },
             {
             headline: "スポーツをしていますか？",
             items: [
             {label: "野球", name: "野球", model: "", type: "check"},
             {label: "サッカー", name: "サッカー", model: "", type: "check"},
             {label: "水泳", name: "水泳", model: "", type: "check"},
             {label: "その他", name: "その他", model: "", type: "check"},
             {label: "しない", name: "しない", model: "", type: "check"},
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/6",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/8",
             class: "md-accent"
             }
             ]
             },
             {
             headline: "現在、治療中の病気がありますか？",
             items: [
             {label: "糖尿病", name: "糖尿病", model: "", type: "check"},
             {label: "ぜんそく", name: "ぜんそく", model: "", type: "check"},
             {label: "心臓病", name: "心臓病", model: "", type: "check"},
             {label: "高血圧", name: "高血圧", model: "", type: "check"},
             {label: "肝臓病", name: "肝臓病", model: "", type: "check"},
             {label: "腎臓病", name: "腎臓病", model: "", type: "check"},
             {label: "脳梗塞", name: "脳梗塞", model: "", type: "check"},
             {label: "胃潰瘍", name: "胃潰瘍", model: "", type: "check"},
             {label: "その他", name: "その他", model: "", type: "check"},
             {label: "ない", name: "ない", model: "", type: "check"},
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/7",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/9",
             class: "md-accent"
             }
             ]
             },
             {
             headline: "普段飲んでいる薬はありますか？",
             items: [
             {label: "心臓の薬", name: "心臓の薬", model: "", type: "check"},
             {label: "血をかたまりにくくする薬", name: "血をかたまりにくくする薬", model: "", type: "check"},
             {label: "その他", name: "その他", model: "", type: "check"},
             {label: "ない", name: "ない", model: "", type: "check"},
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/8",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/10",
             class: "md-accent"
             }
             ]
             },
             {
             headline: "今までに大きな病気にかかったり手術を受けたことがありますか？",
             items: [
             {
             label: "大きな病気",
             name: "大きな病気",
             model: "",
             type: "select",
             items: ["ない", "ある"]
             },
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             validate: false,
             path: "/browse/9",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/11",
             class: "md-accent"
             }
             ]
             },
             {
             headline: "薬・注射　などでアレルギー症状が出たことがありますか？",
             items: [
             {
             label: "アレルギー",
             name: "アレルギー",
             model: "",
             type: "select",
             items: ["ない", "ある"]
             },
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             truedate: true,
             path: "/browse/10",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/12",
             class: "md-accent"
             }
             ]
             },
             {
             headline: "アレルギー体質といわれたことがありますか？",
             items: [
             {
             label: "アレルギー体質",
             name: "アレルギー体質",
             model: "",
             type: "select",
             items: ["ない", "ある"]
             },
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             truedate: true,
             path: "/browse/11",
             class: "md-primary"
             },
             {
             label: "女性",
             name: "女性",
             model: "",
             type: "button",
             validate: true,
             path: "/browse/13",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/write",
             class: "md-accent"
             }
             ]
             },
             {
             headline: "女性の方のみごご回答ください",
             items: [
             {label: "妊娠中", name: "妊娠中", model: "", type: "check"},
             {label: "妊娠中でない", name: "妊娠中でない", model: "", type: "check"},
             {label: "授乳中", name: "授乳中", model: "", type: "check"},
             {label: "授乳中でない", name: "授乳中でない", model: "", type: "check"},
             {
             label: "戻る",
             name: "戻る",
             model: "",
             type: "button",
             truedate: true,
             path: "/browse/12",
             class: "md-primary"
             },
             {
             label: "次へ",
             name: "次へ",
             model: "",
             type: "button",
             validate: true,
             path: "/write",
             class: "md-accent"
             }
             ]
             }
             ],
             耳鼻いんこう科: [],
             小児科: [] */
        }
    }
);

controllers.value("CurrentPatient", {
    "Information": {
        "name": "",
        "insurance": ""
    },
    "Status": "",
    "Category": "",
    'Input': {}
});

// Patient resource
controllers.factory('PatientQuery', ['$resource', function ($resource):any {
    return $resource('/patient/query/:query', {query: '@query'}, {
        query: {method: 'GET'}
    });
}]);

controllers.factory('Patient', ['$resource', function ($resource):any {
    return $resource('/patient/:id', {}, {
        get: {method: 'GET'},
        update: {method: 'PUT'}
    });
}]);

controllers.factory('ViewItem', ['$resource', function ($resource):any {
    return $resource('/view', {}, {
        get: {method: 'GET'}
    });
}]);

function List(resource, query, success) {
    var result:any = [];

    var today:Date = new Date();
    today.setHours(23, 59, 59, 99);
    var yesterday:Date = new Date();
    yesterday.setHours(0, 0, 0, 1);
    var query:any = {$and: [{Date: {$lte: today}}, {Date: {$gt: yesterday}}]};

    resource.query({query: encodeURIComponent(JSON.stringify(query))}, function (data, headers) {
        if (data != null) {
            if (data.code == 0) {
                success(data.value, headers);
            }
        }
    });
}

controllers.controller('BrowseSController', ["$scope", "$stateParams", "$location", 'Patient', 'PatientQuery', "CurrentPatient", "Global", 'ViewItem', 'Views',
    function ($scope, $stateParams, $location, Patient, PatientQuery, CurrentPatient, Global, ViewItem, Views) {

        var resource = new ViewItem();
        resource.$get({}, function (data, headers) {
            if (data != null) {
                if (data.code == 0) {
                    var hoge = data.value[0].Data;
                    Views.Data = hoge;
                }

            }
        });

        List(PatientQuery, {}, function (data, headers) {
            $scope.patients = data;
        });

        $scope.next = function (id) {

            var resource = new Patient();
            resource.$get({id: id}, function (data, headers) {

                if (data != null) {
                    if (data.code == 0) {
                        CurrentPatient.id = id;

                        CurrentPatient.Category = data.value.Category;
                        CurrentPatient.Information = data.value.Information;

                        $scope.Information = CurrentPatient.Information;
                        $scope.Input = CurrentPatient.Input;

                        $location.path('/browse/0');
                    }
                }
            });
        };

        // SocketIO
        if (Global.socket == null) {
            Global.socket = io.connect();
        }

        Global.socket.on('client', function (data):void {
            if (data.value === "1") {
                List(PatientQuery, {}, function (data, headers) {
                    $scope.patients = data;
                });
            }
        });

    }]);

controllers.controller('BrowseController', ["$scope", "$stateParams", "$location", "CurrentPatient", 'Views',
    function ($scope, $stateParams, $location, CurrentPatient, Views) {
        $scope.Input = CurrentPatient.Input;

        var page = $stateParams.page;

        var color = "rgba(200, 20, 30, 0.4)";

        $scope.contents = Views.Data[CurrentPatient.Category][page];

        if ($scope.contents.picture != null) {
            var canvas : fabric.ICanvas = new fabric.Canvas('c');

            _.map($scope.contents.picture, function (value:any, key) {

                if ($scope.Input[value.name] == null) {
                    fabric.Image.fromURL(value.path, function (image) {
                        var schema = image.scale(1).set({left: 5, top: 5});
                        canvas.add(schema);
                        schema.lockMovementX = true;
                        schema.lockMovementY = true;
                        schema.lockRotation = true;
                        schema.lockScaling = true;
                        schema.hasControls = false;
                        schema.hasBorders = false;
                    });
                }

                var hoge = JSON.stringify($scope.Input[value.name]);
                canvas.loadFromJSON(hoge, canvas.renderAll.bind(canvas), function (o, object) {
                });
            });

            canvas.on({

                'touch:gesture': function (options) {
                    var a = 1;
                },
                'touch:drag': function (options) {
                    var a = 1;
                },
                'touch:orientation': function (options) {
                    var a = 1;
                },
                'touch:shake': function (options) {
                    var a = 1;
                },
                'touch:longpress': function (options) {
                    var a = 1;
                },
                'mouse:up': function (options) {
                    var radius = 20;

                    var browser = new Browser();// browser_is();
                    if (browser.isTablet) {
                        var circle = new fabric.Circle({
                            radius: radius,
                            fill: color,
                            left: options.e.changedTouches[0].clientX - (radius / 2) - canvas._offset.left,
                            top: options.e.changedTouches[0].clientY - (radius / 2) - canvas._offset.top
                        });
                    }
                    else {
                        var circle = new fabric.Circle({
                            radius: radius,
                            fill: color,
                            left: options.e.layerX - (radius / 2),
                            top: options.e.layerY - (radius / 2)
                        });

                    }
                    canvas.add(circle);
                }
            });
        }

        $scope.setColor = function (val) {
            color = val;
        };

        $scope.next = function (path) {

            _.map($scope.contents.items, function (value:any, key) {
                $scope.Input[value.name] = {'name': value.name, 'value': value.model, 'type': value.type};
            });

            _.map($scope.contents.picture, function (value:any, key) {
                $scope.Input[value.name] = {'name': value.name, 'value': canvas.toJSON(), 'type': value.type};
            });

            CurrentPatient.Input = $scope.Input;

            $location.path(path);
        };

    }]);

controllers.controller('ConfirmController', ["$scope", "$stateParams", "$location", "CurrentPatient", "Patient", 'Global',
    function ($scope, $stateParams, $location, CurrentPatient, Patient, Global) {
        $scope.Input = CurrentPatient.Input;

    }]);

controllers.controller('WriteController', ["$scope", "$stateParams", "$location", "CurrentPatient", "Patient", 'Global',
    function ($scope, $stateParams, $location, CurrentPatient, Patient, Global) {
        $scope.Input = CurrentPatient.Input;

        $scope.send = true;

        var post = new Patient();
        post.Input = CurrentPatient.Input;
        post.Status = "Accepted";
        post.$update({id: CurrentPatient.id}, function (result, headers) {
            CurrentPatient.Input = {};

            $location.path('/browseS');

            Global.socket.emit('server', {value: "1"});
            $scope.send = false;
        });

    }]);
