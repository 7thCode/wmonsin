/**
 confugure.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

'use strict';

class Configure {
    public initView:any;

    constructor() {
        this.initView = {
            Views: [
                {
                    Name: "内科", ReadOnly: true, Pages: [
                    {
                        headline: "どのような症状ですか？",
                        items: [
                            {label: "発熱", name: "症状-発熱", model: "", type: "check"},
                            {label: "嘔気・嘔吐", name: "症状-嘔気・嘔吐", model: "", type: "check"},
                            {label: "咳", name: "症状-咳", model: "", type: "check"},
                            {label: "食欲低下", name: "症状-食欲低下", model: "", type: "check"},
                            {label: "体重減少", name: "症状-体重減少", model: "", type: "check"},
                            {label: "下痢", name: "症状-下痢", model: "", type: "check"},

                            {label: "腹痛", name: "症状-腹痛", model: "", type: "check"},
                            {label: "胃痛", name: "症状-胃痛", model: "", type: "check"},
                            {label: "頭痛", name: "症状-頭痛", model: "", type: "check"},
                            {label: "胸痛", name: "症状-胸痛", model: "", type: "check"},
                            {label: "喘息（ぜいぜいする）", name: "症状-喘息", model: "", type: "check"},

                            {label: "息苦しい", name: "症状-息苦しい", model: "", type: "check"},
                            {label: "体のむくみ", name: "症状-体のむくみ", model: "", type: "check"},

                            {label: "その他", name: "症状-その他", model: "", type: "check"},
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/1",
                                class: "md-accent"
                            }
                        ],
                        picture: []
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
                                label: "navi1",
                                name: "navi1",
                                model: "",
                                type: "navigation",
                                next: {
                                    label: "次へ",
                                    name: "次へ",
                                    path: "/browse/2",
                                    class: "md-accent"
                                },
                                back: {
                                    label: "戻る",
                                    name: "戻る",
                                    path: "/browse/0",
                                    class: "md-primary"
                                },
                                return: {
                                    label: "戻る",
                                    name: "戻る",
                                    path: "/write",
                                    class: "md-primary"
                                }
                            },
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/2",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/0",
                                class: "md-primary"
                            }
                        ],
                        picture: []
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
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/3",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/1",
                                class: "md-primary"
                            }
                        ],
                        picture: []
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
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/4",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/2",
                                class: "md-primary"
                            }
                        ],
                        picture: []
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

                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/5",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/3",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    },
                    {
                        headline: "大きな病気・手術をされたことがある場合、どのような病気・手術をされましたか？",
                        items: [
                            {label: "糖尿病", name: "大きな病気-糖尿病", model: "", type: "check"},
                            {label: "ぜんそく", name: "大きな病気-ぜんそく", model: "", type: "check"},
                            {label: "心臓病", name: "大きな病気-心臓病", model: "", type: "check"},
                            {label: "高血圧", name: "大きな病気-高血圧", model: "", type: "check"},
                            {label: "肝臓病", name: "大きな病気-肝臓病", model: "", type: "check"},
                            {label: "腎臓病", name: "大きな病気-腎臓病", model: "", type: "check"},

                            {label: "脳梗塞", name: "大きな病気-脳梗塞", model: "", type: "check"},
                            {label: "胃潰瘍", name: "大きな病気-胃潰瘍", model: "", type: "check"},
                            {label: "緑内障", name: "大きな病気-緑内障", model: "", type: "check"},
                            {label: "その他", name: "大きな病気-その他", model: "", type: "check"},
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/6",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/4",
                                class: "md-primary"
                            }
                        ],
                        picture: []
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
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/7",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/5",
                                class: "md-primary"
                            }
                        ],
                        picture: []
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
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/write",
                                class: "md-accent"
                            },
                            {
                                label: "女性",
                                name: "女性",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/8",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/6",
                                class: "md-primary"
                            }
                        ],
                        picture: []
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
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/write",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/7",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    }

                ]
                },
                {
                    Name: "外科", ReadOnly: true, Pages: [
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
                                class: "md-accent"
                            }
                        ],
                        picture: []
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
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/2",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/0",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    },
                    {
                        headline: "痛いところは？",
                        items: [
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/3",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/1",
                                class: "md-primary"
                            }
                        ],
                        picture: [
                            {
                                label: "",
                                name: "痛いところ",
                                model: "",
                                type: "picture",
                                path: 'schema1.png',
                                width: 300,
                                height: 600
                            }
                        ]
                    },
                    {
                        headline: "その症状はいつからですか？",
                        items: [
                            {label: "その症状はいつからですか", name: "いつからですか", model: "", type: "text", items: []},
                            {label: "現在、治療中の病気がありますか", name: "治療中の病気あり", model: "", type: "check"},
                            {label: "その他", name: "その他", model: "", type: "text", items: []},
                            {label: "職業", name: "職業", model: "", type: "text", items: []},
                            {label: "仕事の内容", name: "仕事の内容", model: "", type: "text", items: []},
                            {label: "スポーツ歴", name: "スポーツ歴", model: "", type: "text", items: []},
                            {label: "年数", name: "年数", model: "", type: "text", items: []},
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/5",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/3",
                                class: "md-primary"
                            }
                        ],
                        picture: []
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
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                validate: true,
                                type: "button",
                                path: "/browse/6",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                validate: false,
                                type: "button",
                                path: "/browse/4",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    },
                    {
                        headline: "普段飲んでいる薬はありますか？",
                        items: [
                            {label: "普段飲んでいる薬はありますか", name: "普段飲んでいる薬あり", model: "", type: "check"},
                            {
                                label: "症状", name: "症状", model: "", type: "select", items: ["心臓の薬",
                                "血をかたまりにくくする薬",
                                "その他"]
                            },
                            {label: "その他", name: "その他", model: "", type: "text", items: []},
                            {label: "今までに大きな病気にかかったり手術を受けたことがありますか", name: "大きな病気あり", model: "", type: "check"},
                            {label: "薬・注射　などでアレルギー症状が出たことがありますか", name: "アレルギ症状あり", model: "", type: "check"},
                            {label: "アレルギー体質といわれたことがありますか", name: "アレルギー体質あり", model: "", type: "check"},
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/8",
                                class: "md-accent"
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
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/5",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    },
                    {
                        headline: "現在妊娠中ですか？",
                        items: [
                            {label: "現在妊娠中ですか", name: "妊娠中", model: "", type: "check"},
                            {label: "現在授乳中ですか", name: "授乳中", model: "", type: "check"},
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/9",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/6",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    },
                    {
                        headline: "thanks",
                        items: [
                            {
                                label: "終わり",
                                name: "終わり",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/write",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/6",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    },
                    {
                        headline: "thanks",
                        items: [
                            {
                                label: "終わり",
                                name: "終わり",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/write",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/7",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    }
                ]
                },
                {
                    Name: "整形外科", ReadOnly: true, Pages: [
                    {
                        headline: "身長を入力して下さい",
                        items: [
                            {label: "身長を入力して下さい", name: "身長(cm)", model: "", type: "numeric"},
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/1",
                                class: "md-accent"
                            }
                        ],
                        picture: []
                    },
                    {
                        headline: "体重を入力して下さい",
                        items: [
                            {label: "体重を入力して下さい", name: "体重(Kg)", model: "", type: "numeric"},
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/2",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/0",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    },
                    {
                        headline: "どうされましたか？",
                        items: [
                            {label: "動作時に痛みがある", name: "症状-動作時に痛みがある", model: "", type: "check"},
                            {label: "じっとしていても痛みがある", name: "症状-じっとしていても痛みがある", model: "", type: "check"},
                            {label: "しびれがある", name: "症状-しびれがある", model: "", type: "check"},
                            {label: "はれている", name: "症状-はれている", model: "", type: "check"},
                            {label: "できものがある", name: "症状-できものがある", model: "", type: "check"},
                            {label: "熱感がある", name: "症状-熱感がある", model: "", type: "check"},
                            {label: "その他", name: "症状-その他", model: "", type: "check"},
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/3",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/1",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    },
                    {
                        headline: "診て欲しいところをタッチして下さい",
                        items: [
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/4",
                                class: "md-accent"
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
                        ],
                        picture: [
                            {
                                label: "",
                                name: "痛いところ",
                                model: "",
                                type: "picture",
                                path: 'schema1.png',
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
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/5",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/3",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    },
                    {
                        headline: "考えられる原因はありますか？",
                        items: [
                            {label: "交通事故", name: "考えられる原因-交通事故", model: "", type: "check"},
                            {label: "仕事中の負傷（労災）", name: "考えられる原因-仕事中の負傷（労災）", model: "", type: "check"},
                            {label: "仕事中の負傷（公災）", name: "考えられる原因-仕事中の負傷（公災）", model: "", type: "check"},
                            {label: "スポーツ", name: "考えられる原因-スポーツ", model: "", type: "check"},
                            {label: "転倒", name: "考えられる原因-転倒", model: "", type: "check"},
                            {label: "その他", name: "考えられる原因-その他", model: "", type: "check"},
                            {label: "特に原因なし", name: "考えられる原因-特に原因なし", model: "", type: "check"},
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/6",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/4",
                                class: "md-primary"
                            }
                        ],
                        picture: []
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
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/7",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/5",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    },
                    {
                        headline: "スポーツをしていますか？",
                        items: [
                            {label: "野球", name: "スポーツ-野球", model: "", type: "check"},
                            {label: "サッカー", name: "スポーツ-サッカー", model: "", type: "check"},
                            {label: "水泳", name: "スポーツ-水泳", model: "", type: "check"},
                            {label: "その他", name: "スポーツ-その他", model: "", type: "check"},
                            {label: "しない", name: "スポーツ-しない", model: "", type: "check"},
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/8",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/6",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    },
                    {
                        headline: "現在、治療中の病気がありますか？",
                        items: [
                            {label: "糖尿病", name: "治療中の病気-糖尿病", model: "", type: "check"},
                            {label: "ぜんそく", name: "治療中の病気-ぜんそく", model: "", type: "check"},
                            {label: "心臓病", name: "治療中の病気-心臓病", model: "", type: "check"},
                            {label: "高血圧", name: "治療中の病気-高血圧", model: "", type: "check"},
                            {label: "肝臓病", name: "治療中の病気-肝臓病", model: "", type: "check"},
                            {label: "腎臓病", name: "治療中の病気-腎臓病", model: "", type: "check"},
                            {label: "脳梗塞", name: "治療中の病気-脳梗塞", model: "", type: "check"},
                            {label: "胃潰瘍", name: "治療中の病気-胃潰瘍", model: "", type: "check"},
                            {label: "その他", name: "治療中の病気-その他", model: "", type: "check"},
                            {label: "ない", name: "治療中の病気-ない", model: "", type: "check"},
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/9",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/7",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    },
                    {
                        headline: "普段飲んでいる薬はありますか？",
                        items: [
                            {label: "心臓の薬", name: "普段飲んでいる薬-心臓の薬", model: "", type: "check"},
                            {label: "血をかたまりにくくする薬", name: "普段飲んでいる薬-血をかたまりにくくする薬", model: "", type: "check"},
                            {label: "その他", name: "普段飲んでいる薬-その他", model: "", type: "check"},
                            {label: "ない", name: "普段飲んでいる薬-ない", model: "", type: "check"},
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/10",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/8",
                                class: "md-primary"
                            }
                        ],
                        picture: []
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
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/11",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                validate: false,
                                path: "/browse/9",
                                class: "md-primary"
                            }
                        ],
                        picture: []
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
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/browse/12",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                truedate: true,
                                path: "/browse/10",
                                class: "md-primary"
                            }
                        ],
                        picture: []
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
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/write",
                                class: "md-accent"
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
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                truedate: true,
                                path: "/browse/11",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    },
                    {
                        headline: "女性の方のみごご回答ください",
                        items: [
                            {label: "妊娠中", name: "妊娠中", model: "", type: "check"},
                            {label: "妊娠中でない", name: "妊娠中でない", model: "", type: "check"},
                            {label: "授乳中", name: "授乳中", model: "", type: "check"},
                            {label: "授乳中でない", name: "授乳中でない", model: "", type: "check"},
                            {
                                label: "次へ",
                                name: "次へ",
                                model: "",
                                type: "button",
                                validate: true,
                                path: "/write",
                                class: "md-accent"
                            },
                            {
                                label: "戻る",
                                name: "戻る",
                                model: "",
                                type: "button",
                                truedate: true,
                                path: "/browse/12",
                                class: "md-primary"
                            }
                        ],
                        picture: []
                    }
                ]
                },
                {Name: "耳鼻いんこう科", ReadOnly: true, Pages: []},
                {Name: "小児科", ReadOnly: true, Pages: []}
            ]
        };
    }
}

module.exports = Configure;


