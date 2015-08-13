/**
 index.js

 Copyright (c) 2015 7ThCode.

 This software is released under the MIT License.

 http://opensource.org/licenses/mit-license.php

 */

/// <reference path="../../DefinitelyTyped/lib.d.ts"/>
/// <reference path="../../DefinitelyTyped/node/node.d.ts" />
/// <reference path="../../DefinitelyTyped/express/express.d.ts" />
/// <reference path="../../DefinitelyTyped/mongoose/mongoose.d.ts" />
/// <reference path="result.d.ts" />

'use strict';

var express = require('express');
var emitter = require('events').EventEmitter;
var _ = require('lodash');
var Patient = require('./patient');
var Account = require('./account');
var View = require('./view');

var ToHtml = require('./tohtml');

var csurf = require('csurf');
var crypto = require("crypto");

var router = express.Router();

var fs = require('fs');
var text = fs.readFileSync('config/config.json', 'utf-8');
var config = JSON.parse(text);

var onfigure = require('./configure');

var result = require('./result');


//var emitter = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });
//non csrf
//router.get('/', function (req, res, next) {
//    res.render('/');
//});

//csrf


module.exports = router;

User("root", ():void => {
    var account = new Account();
    account.username = "root";
    account.password = Cipher("root", config.key1);
    account.type = "Admin";
    account.key = Cipher("root", config.key2);
    account.save((saveerror:any):void => {
    });
}, (message:string, error:any):void => {
});


View.count({}, (counterror:any, count:number):void => {
    if (!counterror) {
        if (count <= 0) {
            var ev = new emitter;

            ev.on("view", function (data) {
                var view = new View();
                view.Name = data.Name;
                view.Pages = data.Pages;
                view.save(function (error) {
                    var a = 1;
                });
            });

            var config = new onfigure;
            var views = config.initView.Views;
            _.each(views, function (data, index) {
                ev.emit("view", data);
            });
        }
    }
});

function Cipher(name:any, pass:any):any {
    var cipher:any = crypto.createCipher('aes192', pass);
    cipher.update(name, 'utf8', 'hex');
    return cipher.final('hex');
}

function Authenticate(key:any, success:any, error:any):void {
    Account.findOne({key: key}, (finderror:any, doc:any):void => {
        if (!finderror) {
            if (doc) {
                success(doc.type);
            } else {
                error("No Account", {});
            }
        } else {
            error("Find Error", finderror);
        }
    });
}

function User(name:any, success:any, error:any):void {
    Account.findOne({username: name}, (finderror:any, doc:any):void => {
        if (!finderror) {
            if (doc == null) {
                success();
            } else { //already
                error("Already Found", {});
            }
        } else {
            error("Find Error", finderror);
        }
    });
}

function GetView(name:string, success:any, notfound:any, error:any):void {
    View.findOne({"Name": name}, (finderror:any, doc:any):void => {
        if (!finderror) {
            if (doc) {
                success(doc);
            } else {
                notfound();
            }
        } else {
            error("Find Error", finderror);
        }
    });
}

function BasicHeader(response:any, session:any):any {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Pragma", "no-cache");
    response.header("Cache-Control", "no-cache");
    //  response.header('x-session', session);
    response.contentType('application/json');
    return response;
}

router.get('/', (req:any, res:any):void => {
    res.render('index');
});


router.get('/partials/logo', (req:any, res:any, next:Function):void => {
    res.render('partials/logo');
});


router.get('/backend/', (req:any, res:any):void => {
    res.render('backend/index');
});

router.get('/backend/partials/patient/start', (req:any, res:any):void => {
    res.render('backend/partials/patient/start');
});

router.get('/backend/partials/patient/patients', (req:any, res:any):void => {
    res.render('backend/partials/patient/patients');
});

router.get('/backend/partials/patient/description', (req:any, res:any):void => {
    res.render('backend/partials/patient/description');
});

router.get('/backend/partials/patient/patientacceptdialog', (req:any, res:any):void => {
    res.render('backend/partials/patient/patientacceptdialog');
});

router.get('/backend/partials/patient/sheet', (req:any, res:any):void => {
    res.render('backend/partials/patient/sheet');
});


router.get('/backend/partials/account/accounts', (req:any, res:any):void => {
    res.render('backend/partials/account/accounts');
});

router.get('/backend/partials/account/logindialog', (req:any, res:any):void => {
    res.render('backend/partials/account/logindialog');
});

router.get('/backend/partials/account/registerdialog', (req:any, res:any):void => {
    res.render('backend/partials/account/registerdialog');
});

router.get('/backend/partials/account/deletedialog', (req:any, res:any):void => {
    res.render('backend/partials/account/deletedialog');
});

router.get('/backend/partials/account/accountdialog', (req:any, res:any):void => {
    res.render('backend/partials/account/accountdialog');
});

router.get('/backend/partials/edit/departmentcreatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/departmentcreatedialog');
});

router.get('/backend/partials/edit/departmentdeletedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/departmentdeletedialog');
});

router.get('/backend/partials/edit/pagecreatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/pagecreatedialog');
});

router.get('/backend/partials/edit/pagedeletedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/pagedeletedialog');
});


router.get('/backend/partials/edit/item/checkcreatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/checkcreatedialog');
});

router.get('/backend/partials/edit/item/selectcreatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/selectcreatedialog');
});

router.get('/backend/partials/edit/item/numericcreatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/numericcreatedialog');
});

router.get('/backend/partials/edit/item/picturecreatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/picturecreatedialog');
});

router.get('/backend/partials/edit/item/buttoncreatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/buttoncreatedialog');
});

router.get('/backend/partials/edit/itemcreatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/itemcreatedialog');
});

router.get('/backend/partials/edit/itemupdatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/itemupdatedialog');
});

router.get('/backend/partials/edit/itemdeletedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/itemdeletedialog');
});








router.get('/backend/partials/edit/departments', (req:any, res:any):void => {
    res.render('backend/partials/edit/departments');
});

router.get('/backend/partials/edit/department', (req:any, res:any):void => {
    res.render('backend/partials/edit/department');
});


router.get('/backend/partials/edit/page', (req:any, res:any):void => {
    res.render('backend/partials/edit/page');
});


router.get('/backend/partials/controll/notification', (req:any, res:any):void => {
    res.render('backend/partials/controll/notification');
});

router.get('/backend/partials/controll/panel', (req:any, res:any):void => {
    res.render('backend/partials/controll/panel');
});


router.get('/backend/partials/error', (req:any, res:any):void => {
    res.render('backend/partials/error');
});


router.get('/front/', (req:any, res:any):void => {
    res.render('front/index');
});

router.get('/front/partials/browseS', (req:any, res:any):void => {
    res.render('front/partials/browseS');
});

router.get('/front/partials/browse', (req:any, res:any):void => {
    res.render('front/partials/browse');
});

router.get('/front/partials/write', (req:any, res:any):void => {
    res.render('front/partials/write');
});


/*! patient */
/*! create */

router.post('/patient/accept', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        var patient:any = new Patient();
        patient.Information = req.body.Information;
        patient.Date = new Date();
        patient.Category = req.body.Category;

        //    var now =  patient.Date;

        //    var hour =  ("0"+ now.getHours()).slice(-2); // 時
        //    var min = ("0"+ now.getMinutes()).slice(-2); // 時 ;
        //    var sec = ("0"+ now.getSeconds()).slice(-2); // 時 ;

        //    patient.Information.time = hour + ":" + min + ":" + sec;

        //t0S　ーーhoke
        //t01 --なまえ

        Patient.find({"$and": [{'Information.name': patient.Information.name}, {'Information.time': patient.Information.time}]}, function (finderror, docs) {
            if (!finderror) {
                if (docs.length == 0) {
                    patient.save((saveerror:any):void => {
                        if (!saveerror) {
                            res.send(JSON.stringify(new result(0, "patient accepted.", patient.Status)));
                        } else {
                            res.send(JSON.stringify(new result(100, "patient status put", saveerror)));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify(new result(10, "patient query no item", {})));
                }
            } else {
                res.send(JSON.stringify(new result(100, "patient query", finderror)));
            }
        });
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "patient accept " + e.message, e)));
    }
});

/*! get */
router.get('/patient/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                var id:string = req.params.id;
                Patient.findById(id, (finderror:any, patient:any):void => {
                    if (!finderror) {
                        if (patient) {
                            res.send(JSON.stringify(new result(0, "OK", patient)));
                        } else {
                            res.send(JSON.stringify(new result(10, "patient get", {})));
                        }
                    } else {
                        res.send(JSON.stringify(new result(100, "patient get", finderror)));
                    }
                });
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "patient get auth " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "patient get no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "patient get e.message", e)));
    }
});

/*! update */
router.put('/patient/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                // if (type != "Viewer")
                {
                    var id:string = req.params.id;
                    Patient.findById(id, (finderror:any, patient:any):void => {
                        if (!finderror) {
                            if (patient) {
                                patient.Status = req.body.Status;
                                patient.Input = req.body.Input;
                                patient.save((saveerror:any):void => {
                                    if (!saveerror) {
                                        res.send(JSON.stringify(new result(0, "OK", {})));
                                    } else {
                                        res.send(JSON.stringify(new result(100, "patient put", saveerror)));
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(new result(10, "patient put", {})));
                            }
                        } else {
                            res.send(JSON.stringify(new result(100, "patient put", finderror)));
                        }
                    });
                }
                //      else {
                //        res.send(JSON.stringify(new result(1, "patient put", "no rights")));
                //      }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "patient put " + message, error)));
            });
        }
        else {
            res.send(JSON.stringify(new result(2000, "patient put no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "patient put " + e.message, e)));
    }
});

/*! delete */
router.delete('/patient/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    var id:string = req.params.id;
                    Patient.remove({_id: id}, (finderror:any):void => {
                        if (!finderror) {
                            res.send(JSON.stringify(new result(0, "OK", {})));
                        } else {
                            res.send(JSON.stringify(new result(100, "patient delete", finderror)));
                        }
                    });
                } else {
                    res.send(JSON.stringify(new result(1, "patient delete no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "patient delete " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "patient delete no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "patient delete " + e.message, e)));
    }
});

/*! query */
router.get('/patient/query/:query', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                var query = JSON.parse(decodeURIComponent(req.params.query));
                Patient.find(query, {}, {sort: {Date: -1}}, (finderror:any, docs:any):void => {
                    if (!finderror) {
                        if (docs) {
                            res.send(JSON.stringify(new result(0, "OK", docs)));
                        } else {
                            res.send(JSON.stringify(new result(10, "patient query", {})));
                        }
                    } else {
                        res.send(JSON.stringify(new result(100, "patient query", finderror)));
                    }
                });
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "patient query " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "patient query no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "patient query " + e.message, e)));
    }
});

/*! status */
router.get('/patient/status/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                var id:string = req.params.id;
                Patient.findById(id, (finderror:any, patient:any):void => {
                    if (!finderror) {
                        if (patient) {
                            res.send(JSON.stringify(new result(0, "OK", patient.Status)));
                        } else {
                            res.send(JSON.stringify(new result(10, "patient status get id error", {})));
                        }
                    } else {
                        res.send(JSON.stringify(new result(100, "patient status get", finderror)));
                    }
                });

            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "patient status " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "patient status get no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "patient status get " + e.message, e)));
    }
});

router.put('/patient/status/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    var id:string = req.params.id;
                    Patient.findById(id, (finderror:any, patient:any):void => {
                        if (!finderror) {
                            if (patient) {
                                patient.Status = req.body.Status;
                                patient.save((saveerror:any):void => {
                                    if (!saveerror) {
                                        res.send(JSON.stringify(new result(0, "OK", patient.Status)));
                                    } else {
                                        res.send(JSON.stringify(new result(100, "patient status put", saveerror)));
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(new result(10, "patient status put", {})));
                            }
                        } else {
                            res.send(JSON.stringify(new result(100, "patient status put", finderror)));
                        }
                    });
                } else {
                    res.send(JSON.stringify(new result(1, "patient status put no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "patient status " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "patient status put no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "patient status put " + e.message, e)));
    }
});

/*! account */
/*! create */
router.post('/account/create', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    User(req.body.username.toLowerCase(), ():void => {
                        var account:any = new Account();
                        account.username = req.body.username.toLowerCase();
                        account.password = Cipher(req.body.password, config.key1);
                        account.type = req.body.type;
                        account.key = Cipher(req.body.username, config.key2);
                        account.save((saveerror:any):void => {
                            if (!saveerror) {
                                res.send(JSON.stringify(new result(0, "OK", {})));
                            } else {
                                res.send(JSON.stringify(new result(100, "account create", saveerror)));
                            }
                        });
                    }, (message:string, error:any):void => {
                        res.send(JSON.stringify(new result(3, "account create " + message, error)));
                    });
                } else {
                    res.send(JSON.stringify(new result(1, "account create no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "account create " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "account create no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "account create " + e.message, e)));
    }
});

/*! logout */
router.post('/account/logout', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        req.session.destroy();
        res.send(JSON.stringify(new result(0, "", {})));
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "account logout " + e.message, e)));
    }
});

/*! login */
router.post('/account/login', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        var username:any = req.body.username;
        var password:any = Cipher(req.body.password, config.key1);
        var auth:any = {$and: [{username: username}, {password: password}]};
        Account.findOne(auth, (finderror:any, account:any):void => {
            if (!finderror) {
                if (account) {
                    if (req.session) {
                        if (req.session.key == null) {
                            req.session.key = account.key;
                        }
                        res.send(JSON.stringify(new result(0, "logged in success.", account)));
                    }
                } else {
                    res.send(JSON.stringify(new result(10, "unknown user or wrong password.", {})));
                }
            } else {
                res.send(JSON.stringify(new result(100, "unknown user or wrong password.", finderror)));
            }
        });
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "account login fail." + e.message, e)));
    }
});

/*! get */
router.get('/account/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                var id:string = req.params.id;
                Account.findById(id, (geterror:any, account:any):void => {
                    if (!geterror) {
                        if (account) {
                            res.send(JSON.stringify(new result(0, "OK", account)));
                        } else {
                            res.send(JSON.stringify(new result(10, "account get", {})));
                        }
                    } else {
                        res.send(JSON.stringify(new result(100, "account get", geterror)));
                    }
                });
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "account get " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "account get no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "account get " + e.message, e)));
    }
});

/*! update */
router.put('/account/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    var id:string = req.params.id;
                    Account.findById(id, (finderror:any, account:any):void => {
                        if (!finderror) {
                            if (account) {
                                var account2 = account;
                                account2.username = req.body.username;
                                account2.type = req.body.type;
                                account2.save((saveerror:any):void => {
                                    if (!saveerror) {
                                        res.send(JSON.stringify(new result(0, "OK", {})));
                                    } else {
                                        res.send(JSON.stringify(new result(100, "account put", saveerror)));
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(new result(3, "account put find error", {})));
                            }
                        } else {
                            res.send(JSON.stringify(new result(100, "account put find error", finderror)));
                        }
                    });
                } else {
                    res.send(JSON.stringify(new result(1, "account put no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "account put " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "account put no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "account put " + e.message, e)));
    }
});

/*! delete */
router.delete('/account/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    var id:string = req.params.id;
                    Account.remove({_id: id}, (removeerror:any):void => {
                        if (!removeerror) {
                            res.send(JSON.stringify(new result(0, "OK", {})));
                        } else {
                            res.send(JSON.stringify(new result(100, "account delete", removeerror)));
                        }
                    });
                } else {
                    res.send(JSON.stringify(new result(1, "account delete no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "account delete " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "account delete no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "account delete " + e.message, e)));
    }
});

/*! query */
router.get('/account/query/:query', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                var query:any = JSON.parse(decodeURIComponent(req.params.query));
                Account.find({}, (finderror:any, docs:any):void => {
                    if (!finderror) {
                        if (docs) {
                            res.send(JSON.stringify(new result(0, "OK", docs)));
                        } else {
                            res.send(JSON.stringify(new result(10, "account query", {})));
                        }
                    } else {
                        res.send(JSON.stringify(new result(100, "account query", finderror)));
                    }
                });
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "account query " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "account query no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "account query " + e.message, e)));
    }
});

/*! update */
router.put('/account/password/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    var id:string = req.params.id;
                    Account.findById(id, (finderror:any, account:any):void => {
                        if (!finderror) {
                            if (account) {
                                var account2:any = account;
                                account2.password = Cipher(req.body.password, config.key1);
                                account2.save((saveerror:any):void => {
                                    if (!saveerror) {
                                        res.send(JSON.stringify(new result(0, "OK", {})));
                                    } else {
                                        res.send(JSON.stringify(new result(100, "account password", saveerror)));
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(new result(3, "account password find error", {})));
                            }
                        } else {
                            res.send(JSON.stringify(new result(100, "account password find error", finderror)));
                        }
                    });
                } else {
                    res.send(JSON.stringify(new result(1, "account password no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "account password " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "account password no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new  result(10000, "account password " + e.message, e)));
    }
});

/*! config */
/*! get */
router.get('/config', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                res.send(JSON.stringify(new result(0, "config get", config)));
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "config get auth error", {})));
            });
        } else {
            res.send(JSON.stringify(new  result(2000, "config get no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "config get " + e.message, e)));
    }
});

/*! update */
router.put('/config', (req:any, res:any):void => {
    try {
        if (req.session) {
            res = BasicHeader(res, "");
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    config = req.body.body;
                    fs.writeFile('config/config.json', JSON.stringify(config), (error:any):void => {
                        if (!error) {
                            res.send(JSON.stringify(new result(0, "config put", config)));
                        } else {
                            res.send(JSON.stringify(new result(1, "config put write error.", error)));
                        }
                    });
                } else {
                    res.send(JSON.stringify(new result(1, "config put no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "config put " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "config put no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "config put " + e.message, e)));
    }
});

/*! views */
/*! create view */
router.post('/view', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            var view:any = new View();
            var data:any = req.body.data;
            var viewdata:any = JSON.parse(data);
            view.Pages = viewdata.Pages;
            view.Name = viewdata.Name;
            view.save((saveerror:any):void => {
                if (!saveerror) {
                    res.send(JSON.stringify(new result(0, "OK", {})));
                } else {
                    res.send(JSON.stringify(new result(100, "view create", saveerror)));
                }
            });
        } else {
            res.send(JSON.stringify(new result(2000, "view create no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "view create" + e.message, e)));
    }
});

router.post('/view/create', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    View.count({Name:req.body.Name}, (counterror:any, count:number):void => {
                        if (!counterror) {
                            if (count == 0) {
                                var view:any = new View();
                                view.Name = req.body.Name;
                                view.Pages = [];
                                view.save((saveerror:any):void => {
                                    if (!saveerror) {
                                        res.send(JSON.stringify(new result(0, "OK", {})));
                                    } else {
                                        res.send(JSON.stringify(new result(100, "account create", saveerror)));
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(new result(1, "view already exist", {})));
                            }
                        } else {
                            res.send(JSON.stringify(new result(1, "view error", counterror)));
                        }
                    });
                } else {
                    res.send(JSON.stringify(new result(1, "view create no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "view create " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "view create no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "account create " + e.message, e)));
    }
});

/*! get view */
router.get('/view/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");

        var id:string = req.params.id;
        View.findById(id, (finderror:any, doc:any):void => {
            if (!finderror) {
                if (doc) {
                    res.send(JSON.stringify(new result(0, "OK", doc)));
                } else {
                    res.send(JSON.stringify(new result(10, "view get", {})));
                }
            } else {
                res.send(JSON.stringify(new result(100, "view get", finderror)));
            }
        });
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "view get " + e.message, e)));
    }
});

/*! update */
router.put('/view/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    var id:string = req.params.id;
                    View.findById(id, (finderror:any, view:any):void => {
                        if (!finderror) {
                            if (view) {
                                view.Name = req.body.Name;
                                view.Pages = req.body.Pages;
                                view.save((saveerror:any):void => {
                                    if (!saveerror) {
                                        res.send(JSON.stringify(new result(0, "OK", {})));
                                    } else {
                                        res.send(JSON.stringify(new result(100, "view put", saveerror)));
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(new result(3, "view put find error", {})));
                            }
                        } else {
                            res.send(JSON.stringify(new result(100, "view put find error", finderror)));
                        }
                    });
                } else {
                    res.send(JSON.stringify(new result(1, "view put no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "view put " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "view put no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "view put " + e.message, e)));
    }
});

/*! delete */
router.delete('/view/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    var id:string = req.params.id;
                    View.remove({_id: id}, (error:any):void => {
                        if (!error) {
                            res.send(JSON.stringify(new result(0, "OK", {})));
                        } else {
                            res.send(JSON.stringify(new result(100, "view delete", error)));
                        }
                    });
                } else {
                    res.send(JSON.stringify(new result(1, "view delete no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "view delete " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "view delete no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "patient delete " + e.message, e)));
    }
});

/*! query */
router.get('/view/query/:query', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session) {
            Authenticate(req.session.key, (type:any):void => {
                var query:any = JSON.parse(decodeURIComponent(req.params.query));
                View.find({}, (finderror:any, views:any):void => {
                    if (!finderror) {
                        if (views) {
                            res.send(JSON.stringify(new result(0, "OK", views)));
                        } else {
                            res.send(JSON.stringify(new result(10, "account query", {})));
                        }
                    } else {
                        res.send(JSON.stringify(new result(100, "account query", finderror)));
                    }
                });
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new result(2, "account query " + message, error)));
            });
        } else {
            res.send(JSON.stringify(new result(2000, "account query no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new result(10000, "account query " + e.message, e)));
    }
});

//Test area

router.get('/front/partials/browse2/:name', function (req, res, next) {

    var tohtml = new ToHtml();
    /*
     var data = {
     name: "page1", content: {
     tag: "md-content", style: 'background-color: #A0A0FF;',
     childelements: [
     {
     tag: "md-card",
     childelements: [
     {
     tag: "ng-form", name: "validate",
     childelements: [
     {
     tag: "md-card-content", layout: "layout", "layout-align": "center center",
     childelements: [
     {
     tag: "h3", class: "md-headline",
     childelements: [{value: "{{contents.headline}}"}]
     }
     ]
     },
     {
     tag: "md-card-content",
     layout: "layout",
     "layout-align": "center center",
     "ng-show": "contents.picture.length == 1",
     childelements: [
     {
     tag: "md-radio-group",
     childelements: [
     {
     tag: "md-radio-button",
     "ng-click": "setColor('rgba(200, 20, 30, 0.4)')",
     value: "rgba(200, 20, 30, 0.4)",
     childelements: [{value: "{{'itai' | message}}"}]
     },
     {
     tag: "md-radio-button",
     "ng-click": "setColor('rgba(20, 200, 30, 0.4)')",
     value: "rgba(20, 200, 30, 0.4)",
     childelements: [{value: "{{'hare' | message}}"}]
     },
     {
     tag: "md-radio-button",
     "ng-click": "setColor('rgba(20, 20, 200, 0.4)')",
     value: "rgba(20, 20, 200, 0.4)",
     childelements: [{value: "{{'shibire' | message}}"}]
     }
     ]
     },
     {tag: "canvas", id: "c", width: "300", height: "600"},
     {
     tag: "md-button",
     "ng-click": "clearPicture()",
     "class": "md-raised md-warn",
     childelements: [{value: "{{'clear' | message}}"}]
     }
     ]
     },
     {
     tag: "md-list",
     childelements: [
     {
     tag: "md-list-item",
     "layout-align": "center center",
     "ng-repeat": "content in contents.items",
     childelements: [
     {
     tag: "md-card", flex: "flex",
     childelements: [
     {
     tag: "md-card-content", "layout-align": "start center",
     childelements: [
     {
     tag: "md-input-container",
     style: "width:100%",
     "ng-if": "content.type == 'text' &amp;&amp; content.items.length == 0",
     childelements: [
     {
     tag: "label",
     childelements: [{value: "{{content.label}}"}]
     },
     {
     tag: "input",
     "ng-model": "content.model",
     placeholder: "",
     name: "{{content.name}}"
     }
     ]
     },
     {
     tag: "md-input-container",
     style: "width:100%",
     "ng-if": "content.type == 'text' &amp;&amp; content.items.length != 0",
     childelements: [
     {
     tag: "label",
     childelements: [{value: "{{content.label}}"}]
     },
     {
     tag: "input",
     "ng-model": "content.model",
     placeholder: "",
     name: "{{content.name}}",
     "md-maxlength": "30",
     required: "required"
     },
     {
     tag: "div",
     "ng-messages": "validate[content.name].$error",
     childelements: [
     {
     tag: "div",
     "ng-repeat": "item in content.items",
     "ng-message": "{{item.name}}",
     childelements: [{value: "{{item.message}}"}]
     }
     ]
     }
     ]
     },
     {
     tag: "md-radio-group",
     "ng-model": "content.model",
     name: "{{content.name}}",
     "layout-align": "center center",
     "ng-if": "content.type == 'select'",
     required: "required",
     childelements: [
     {
     tag: "div", class: "md-display-1",
     childelements: [{value: "{{content.label}}"}]
     },
     {
     tag: "md-radio-button",
     "ng-repeat": "item in content.items",
     "ng-model": "content.model",
     value: "{{item}}",
     childelements: [
     {
     tag: "div", class: "md-display-1",
     childelements: [{value: "{{item}}"}]
     }
     ]
     },
     ]
     },
     {
     tag: "md-checkbox",
     "ng-model": "content.model",
     "ng-if": "content.type == 'check'",
     "md-no-ink": "md-no-ink",
     "aria-label": "Checkbox No Ink",
     class: "md-primary",
     childelements: [
     {
     tag: "div", class: "md-display-1",
     childelements: [{value: "{{content.label}}"}]
     }
     ]
     },
     {
     tag: "md-button",
     flex: "flex",
     "ng-if": "content.type == 'button' &amp;&amp; content.validate",
     "ng-class": "content.class",
     "ng-click": "next(content.path)",
     "aria-label": "",
     "ng-disabled": "validate.$invalid",
     class: "md-raised",
     childelements: [{value: "{{content.label}}"}]
     },
     {
     tag: "md-button",
     flex: "flex",
     "ng-if": "content.type == 'button' &amp;&amp; !content.validate",
     "ng-class": "content.class",
     "ng-click": "next(content.path)",
     "aria-label": "",
     class: "md-raised",
     childelements: [{value: "{{content.label}}"}]
     },
     {
     tag: "div",
     layout: "column",
     flex: "flex",
     "ng-if": "content.type == 'numeric'",
     childelements: [
     {
     tag: "div", layout: "row", flex: "flex",
     childelements: [
     {
     tag: "md-input-container",
     style: "width:100%",
     childelements: [
     {
     tag: "label",
     childelements: [{value: "{{content.label}}"}]
     },
     {
     tag: "input",
     "ng-model": "content.model",
     placeholder: "",
     name: "{{content.name}}",
     "ng-pattern": "/^[0-9]+$/",
     "md-maxlength": "30",
     required: "required"
     }
     ]
     }
     ]
     },
     {
     tag: "div",
     layout: "row",
     "layout-align": "center center",
     flex: "flex",
     childelements: [
     {
     tag: "div",
     layout: "column",
     "layout-align": "center center",
     flex: "80",
     childelements: [
     {
     tag: "div",
     layout: "row",
     "layout-align": "center center",
     childelements: [
     {
     tag: "md-button",
     flex: "30",
     "ng-click": "content.model = content.model + '1'",
     "aria-label": "",
     class: "md-fab",
     childelements: [{value: "1"}]
     },
     {tag: "div", flex: "5"},
     {
     tag: "md-button",
     flex: "30",
     "ng-click": "content.model = content.model + '2'",
     "aria-label": "",
     class: "md-fab",
     childelements: [{value: "2"}]
     },
     {tag: "div", flex: "5"},
     {
     tag: "md-button",
     flex: "30",
     "ng-click": "content.model = content.model + '3'",
     "aria-label": "",
     class: "md-fab",
     childelements: [{value: "3"}]
     }
     ]
     },
     {tag: "div"},
     {
     tag: "div",
     layout: "row",
     "layout-align": "center center",
     childelements: [
     {
     tag: "md-button",
     flex: "30",
     "ng-click": "content.model = content.model + '4'",
     "aria-label": "",
     class: "md-fab",
     childelements: [{value: "4"}]
     },
     {tag: "div", flex: "5"},
     {
     tag: "md-button",
     flex: "30",
     "ng-click": "content.model = content.model + '5'",
     "aria-label": "",
     class: "md-fab",
     childelements: [{value: "5"}]
     },
     {tag: "div", flex: "5"},
     {
     tag: "md-button",
     flex: "30",
     "ng-click": "content.model = content.model + '6'",
     "aria-label": "",
     class: "md-fab",
     childelements: [{value: "6"}]
     }
     ]
     },
     {tag: "div"},
     {
     tag: "div",
     layout: "row",
     "layout-align": "center center",
     childelements: [
     {
     tag: "md-button",
     flex: "30",
     "ng-click": "content.model = content.model + '7'",
     "aria-label": "",
     class: "md-fab",
     childelements: [{value: "7"}]
     },
     {tag: "div", flex: "5"},
     {
     tag: "md-button",
     flex: "30",
     "ng-click": "content.model = content.model + '8'",
     "aria-label": "",
     class: "md-fab",
     childelements: [{value: "8"}]
     },
     {tag: "div", flex: "5"},
     {
     tag: "md-button",
     flex: "30",
     "ng-click": "content.model = content.model + '9'",
     "aria-label": "",
     class: "md-fab",
     childelements: [{value: "9"}]
     }
     ]
     },
     {tag: "div"},
     {
     tag: "div",
     "layout": "row",
     "layout-align": "center center",
     childelements: [
     {
     tag: "md-button",
     flex: "30",
     "ng-click": "content.model = content.model + '0'",
     "aria-label": "",
     class: "md-fab",
     childelements: [{value: "0"}]
     },
     {tag: "div", flex: "5"},
     {
     tag: "md-button",
     flex: "30",
     "ng-click": "content.model = content.model + '.'",
     "aria-label": "",
     class: "md-fab",
     childelements: [{value: "."}]
     },
     {tag: "div", flex: "5"},
     {
     tag: "md-button",
     flex: "30",
     "ng-click": "content.model = ''",
     "aria-label": "",
     class: "md-fab md-primary",
     childelements: [{value: "Clear"}]
     }
     ]
     },
     {tag: "div", flex: "5"}
     ]
     }
     ]
     }
     ]
     }
     ]
     }
     ]
     }
     ]
     }
     ]
     }
     ]
     }
     ]
     }
     ]
     }
     };
     */
    GetView(req.params.name, (view:any):void => {
        var hoge = tohtml.render(view.Data.content);
        res.send(tohtml.render(view.Data.content));
    }, () => {
        res.send(JSON.stringify(new result(10, "view get", {})));
    }, (message:string, error:any)=> {
        res.send(JSON.stringify(new result(100, "view get", error)));
    });
});

router.get('/json', function (req, res, next) {
    var tohtml = new ToHtml();

    var data = {name: "page1", content: {}};

    data.content = {
        tag: "md-content",
        style: 'page.style',
        childelements: [
            {
                tag: "ng-form",
                name: 'validate',
                childelements: [
                    {
                        tag: "div",
                        childelements: [
                            {
                                tag: "md-card",
                                childelements: [
                                    {
                                        tag: "md-card-content",
                                        childelements: [
                                            {
                                                tag: "md-button",
                                                class: "md-raised md-primary",
                                                style: 'height:30px;width:10px;top:130px;left:200px;z-index:1;position: absolute',
                                                childelements: [{value: "aaaaaaa"}]
                                            },
                                            {
                                                tag: "md-checkbox",
                                                "ng-model": "checkbox",
                                                childelements: [{value: "zz"}]
                                            },
                                            {
                                                tag: "md-input-container",
                                                class: "md-raised md-warn",
                                                childelements: [
                                                    {
                                                        tag: "label",
                                                        childelements: [{value: "AAA"}]
                                                    },
                                                    {
                                                        tag: "input",
                                                        name: "input",
                                                        "ng-model": "input",
                                                        "md-maxlength": "30",
                                                        required: "true"
                                                    },
                                                    {
                                                        tag: "div",
                                                        "ng-messages": "validate.input.$error",
                                                        childelements: [
                                                            {
                                                                tag: "div",
                                                                "ng-message": "md-maxlength",
                                                                childelements: [{value: "max"}]
                                                            },
                                                            {
                                                                tag: "div",
                                                                "ng-message": "required",
                                                                childelements: [{value: "req"}]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                tag: "md-switch",
                                                class: "md-fab md-accent",
                                                "ng-model": "switch",
                                                childelements: [{value: "zz"}]
                                            },
                                            {
                                                tag: "md-radio-group",
                                                class: "md-raised md-primary",
                                                "ng-model": "radio",
                                                childelements: [
                                                    {
                                                        tag: "md-radio-button",
                                                        value: "true",
                                                        childelements: [{value: "AAA"}]
                                                    },
                                                    {
                                                        tag: "md-radio-button",
                                                        value: "false",
                                                        childelements: [{value: "a"}]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };

    //var a = tohtml.render(data);

    var head = '<!DOCTYPE html>' +
        '<html lang="ja">' +
        '<head>' +
        '<meta charset="utf-8">' +
        '<meta name="format-detection" content="telephone=no">' +
        '<meta name="msapplication-tap-highlight" content="no">' +
        '<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height">' +
        '<title>wmonsin</title>' +
        '<link rel="apple-touch-icon" sizes="57x57" href="/favicons/apple-touch-icon-57x57.png">' +
        '<link rel="apple-touch-icon" sizes="60x60" href="/favicons/apple-touch-icon-60x60.png">' +
        '<link rel="apple-touch-icon" sizes="72x72" href="/favicons/apple-touch-icon-72x72.png">' +
        '<link rel="apple-touch-icon" sizes="76x76" href="/favicons/apple-touch-icon-76x76.png">' +
        '<link rel="apple-touch-icon" sizes="114x114" href="/favicons/apple-touch-icon-114x114.png">' +
        '<link rel="apple-touch-icon" sizes="120x120" href="/favicons/apple-touch-icon-120x120.png">' +
        '<link rel="apple-touch-icon" sizes="144x144" href="/favicons/apple-touch-icon-144x144.png">' +
        '<link rel="apple-touch-icon" sizes="152x152" href="/favicons/apple-touch-icon-152x152.png">' +
        '<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon-180x180.png">' +
        '<link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">' +
        '<link rel="icon" type="image/png" href="/favicons/android-chrome-192x192.png" sizes="192x192">' +
        '<link rel="icon" type="image/png" href="/favicons/favicon-96x96.png" sizes="96x96">' +
        '<link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">' +
        '<link rel="manifest" href="/favicons/manifest.json">' +
        '<meta name="msapplication-TileColor" content="#da532c">' +
        '<meta name="msapplication-TileImage" content="/favicons/mstile-144x144.png">' +
        '<meta name="theme-color" content="#ffffff">' +
        '<link rel="stylesheet" type="text/css" href="/bower_components/angular-material/angular-material.min.css">' +
        '<link rel="stylesheet" type="text/css" href="/stylesheets/style.css">' +
        '</head>' +
        '<body layout="column" ng-app="PatientsApplication" style="background-color: #A0A0FF;">';

    var tail = '</body>' +
        '</html>' +
        '<script type="text/javascript" src="/bower_components/jquery/dist/jquery.min.js"></script>' +
        '<script type="text/javascript" src="/socket.io/socket.io.js"></script>' +
        '<script type="text/javascript" src="/bower_components/hammerjs/hammer.min.js"></script>' +
        '<script type="text/javascript" src="/bower_components/angular/angular.min.js"></script>' +
        '<script type="text/javascript" src="/bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>' +
        '<script type="text/javascript" src="/bower_components/angular-animate/angular-animate.min.js"></script>' +
        '<script type="text/javascript" src="/bower_components/angular-aria/angular-aria.min.js"></script>' +
        '<script type="text/javascript" src="/bower_components/angular-material/angular-material.min.js"></script>' +
        '<script type="text/javascript" src="/bower_components/angular-messages/angular-messages.min.js"></script>' +
        '<script type="text/javascript" src="/bower_components/angular-resource/angular-resource.min.js"></script>' +
        '<script type="text/javascript" src="/bower_components/angular-material-icons/angular-material-icons.min.js"></script>' +
        '<script type="text/javascript" src="/bower_components/lodash/lodash.min.js"></script>' +
        '<script type="text/javascript" src="/bower_components/fabric/dist/fabric.min.js"></script>' +
        '<script type="text/javascript" src="/front/javascripts/PatientsApplication.min.js"></script>' +
        '<script type="text/javascript" src="/front/javascripts/PatientsControllers.min.js"></script>' +
        '<script type="text/javascript" src="/javascripts/TopControllers.min.js"></script>';

    res.send(head + tohtml.render(data.content) + tail);
});

//Test area
