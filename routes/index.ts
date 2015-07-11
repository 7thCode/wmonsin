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
var Patient = require('./patient');
var Account = require('./account');
var View = require('./view');

var csurf = require('csurf');
var crypto = require("crypto");

var router = express.Router();

var fs = require('fs');
var text = fs.readFileSync('config/config.json', 'utf-8');
var config = JSON.parse(text);


var Result = require('./result');

//var emitter = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });
//non csrf
//router.get('/', function (req, res, next) {
//    res.render('/');
//});

//csrf


module.exports = router;

/*
class Result {
    private code:number;
    private message:string;
    private value:any;

    constructor(code:number, message:string, value:any) {
        this.code = code;
        this.message = message;
        this.value = value;
    }
}
*/

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

GetView(():void => {
    var view = new View();
    view.Data = initView.Data;
    view.save((saveerror:any):void => {
    });
}, (message:string, error:any):void => {
});

function Cipher(name:any, pass:any):any {
    var cipher:any = crypto.createCipher('aes192', pass);
    cipher.update(name, 'utf8', 'hex');
    return cipher.final('hex');
}

function Authenticate(key, success:any, error:any):void {
    Account.findOne({key: key}, (finderror:any, doc:any):void => {
        if (!finderror) {
            if (doc != null) {
                success(doc.type);
            }
            else {
                error("No Docs", []);
            }
        }
        else {
            error("Find Error", finderror);
        }
    });
}

function User(name:any, success:any, error:any):void {
    Account.findOne({username: name}, (finderror:any, doc:any):void => {
        if (!finderror) {
            if (doc == null) {
                success();
            }
            else { //already
                error("Already Found", []);
            }
        }
        else {
            error("Find Error", finderror);
        }
    });
}

function GetView(success:any, error:any):void {
    View.find({}, {}, {}, (finderror:any, docs:any):void => {
        if (!finderror) {
            if (docs != null) {
                if (docs.length == 0) {
                    success();
                }
                else { //already
                    error("Already Found", []);
                }
            }
            else {
                error("No Docs", []);
            }
        }
        else {
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
                            res.send(JSON.stringify(new Result(0, "patient accepted.", patient.Status)));
                        } else {
                            res.send(JSON.stringify(new Result(100, "patient status put", saveerror)));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(10, "patient query no item", {})));
                }
            } else {
                res.send(JSON.stringify(new Result(100, "patient query", finderror)));
            }
        });
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "patient accept " + e.message, e)));
    }
});

/*! get */
router.get('/patient/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, (type:any):void => {
                var id:string = req.params.id;
                Patient.findById(id, (finderror:any, doc:any):void => {
                    if (!finderror) {
                        if (doc != null) {
                            res.send(JSON.stringify(new Result(0, "OK", doc)));
                        }
                        else {
                            res.send(JSON.stringify(new Result(10, "patient get", {})));
                        }
                    }
                    else {
                        res.send(JSON.stringify(new Result(100, "patient get", finderror)));
                    }
                });
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new Result(2, "patient get auth error", {})));
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "patient get no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "patient get e.message", e)));
    }
});

/*! update */
router.put('/patient/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, (type:any):void => {
                // if (type != "Viewer")
                {
                    var id:string = req.params.id;
                    Patient.findById(id, (finderror:any, patient:any):void => {
                        if (!finderror) {
                            if (patient != null) {
                                patient.Status = req.body.Status;
                                patient.Input = req.body.Input;
                                patient.save((saveerror:any):void => {
                                    if (!saveerror) {
                                        res.send(JSON.stringify(new Result(0, "OK", {})));
                                    } else {
                                        res.send(JSON.stringify(new Result(100, "patient put", saveerror)));
                                    }
                                });
                            }
                            else {
                                res.send(JSON.stringify(new Result(10, "patient put", {})));
                            }
                        }
                        else {
                            res.send(JSON.stringify(new Result(100, "patient put", finderror)));
                        }
                    });
                }
                //      else {
                //        res.send(JSON.stringify(new Result(1, "patient put", "no rights")));
                //      }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new Result(2, "patient put " + message, error)));
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "patient put no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "patient put " + e.message, e)));
    }
});

/*! delete */
router.delete('/patient/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    var id:string = req.params.id;
                    Patient.remove({_id: id}, (finderror:any):void => {
                        if (!finderror) {
                            res.send(JSON.stringify(new Result(0, "OK", {})));
                        } else {
                            res.send(JSON.stringify(new Result(100, "patient delete", finderror)));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(1, "patient delete no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new Result(2, "patient delete " + message, error)));
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "patient delete no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "patient delete " + e.message, e)));
    }
});

/*! query */
router.get('/patient/query/:query', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, (type:any):void => {

                var query = JSON.parse(decodeURIComponent(req.params.query));

                Patient.find(query, {}, {sort: {Date: -1}}, (finderror:any, docs:any):void => {
                    if (!finderror) {
                        if (docs != null) {
                            res.send(JSON.stringify(new Result(0, "OK", docs)));
                        }
                        else {
                            res.send(JSON.stringify(new Result(10, "patient query", {})));
                        }
                    } else {
                        res.send(JSON.stringify(new Result(100, "patient query", finderror)));
                    }
                });
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new Result(2, "patient query " + message, error)));
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "patient query no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "patient query " + e.message, e)));
    }
});

/*! status */
router.get('/patient/status/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, (type:any):void => {

                var id:string = req.params.id;
                Patient.findById(id, (finderror:any, patient:any):void => {
                    if (!finderror) {
                        if (patient != null) {
                            res.send(JSON.stringify(new Result(0, "OK", patient.Status)));
                        }
                        else {
                            res.send(JSON.stringify(new Result(10, "patient status get id error", {})));
                        }
                    }
                    else {
                        res.send(JSON.stringify(new Result(100, "patient status get", finderror)));
                    }
                });

            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new Result(2, "patient status " + message, error)));
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "patient status get no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "patient status get " + e.message, e)));
    }
});

router.put('/patient/status/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    var id:string = req.params.id;
                    Patient.findById(id, (finderror:any, patient:any):void => {
                        if (!finderror) {
                            if (patient != null) {
                                patient.Status = req.body.Status;
                                patient.save((saveerror:any):void => {
                                    if (!saveerror) {
                                        res.send(JSON.stringify(new Result(0, "OK", patient.Status)));
                                    } else {
                                        res.send(JSON.stringify(new Result(100, "patient status put", saveerror)));
                                    }
                                });
                            }
                            else {
                                res.send(JSON.stringify(new Result(10, "patient status put", {})));
                            }
                        }
                        else {
                            res.send(JSON.stringify(new Result(100, "patient status put", finderror)));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(1, "patient status put no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new Result(2, "patient status " + message, error)));
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "patient status put no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "patient status put " + e.message, e)));
    }
});

/*! account */
/*! create */
router.post('/account/create', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
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
                                res.send(JSON.stringify(new Result(0, "OK", {})));
                            } else {
                                res.send(JSON.stringify(new Result(100, "account create", saveerror)));
                            }
                        });
                    }, (message:string, error:any):void => {
                        res.send(JSON.stringify(new Result(3, "account create " + message, error)));
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(1, "account create no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new Result(2, "account create " + message, error)));
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "account create no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "account create " + e.message, e)));
    }
});

/*! logout */
router.post('/account/logout', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        req.session.destroy();
        res.send(JSON.stringify(new Result(0, "", {})));
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "account logout " + e.message, e)));
    }
});

/*! login */
router.post('/account/login', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        var username:any = req.body.username;
        var password:any = Cipher(req.body.password, config.key1);
        var auth:any = {$and: [{username: username}, {password: password}]};
        Account.findOne(auth, (finderror:any, doc:any):void => {
            if (!finderror) {
                if (doc != null) {
                    if (req.session == null) {
                        req.session.regenerate((err:any):void => {
                            req.session.key = doc.key;
                            req.session.save((err:any):void => {
                                res.send(JSON.stringify(new Result(0, "logged in success.", doc)));
                            });
                        });
                    }
                    else {
                        if (req.session.key == null) {
                            req.session.key = doc.key;
                        }
                        res.send(JSON.stringify(new Result(0, "logged in success.", doc)));
                    }
                }
                else {
                    res.send(JSON.stringify(new Result(10, "unknown user or wrong password.", {})));
                }
            } else {
                res.send(JSON.stringify(new Result(100, "unknown user or wrong password.", finderror)));
            }
        });
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "account login fail." + e.message, e)));
    }
});

/*! get */
router.get('/account/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, (type:any):void => {
                var id:string = req.params.id;
                Account.findById(id, (geterror:any, doc:any):void => {
                    if (!geterror) {
                        if (doc != null) {
                            res.send(JSON.stringify(new Result(0, "OK", doc)));
                        }
                        else {
                            res.send(JSON.stringify(new Result(10, "account get", {})));
                        }
                    }
                    else {
                        res.send(JSON.stringify(new Result(100, "account get", geterror)));
                    }
                });
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new Result(2, "account get " + message, error)));
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "account get no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "account get " + e.message, e)));
    }
});

/*! update */
router.put('/account/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    var id:string = req.params.id;
                    Account.findById(id, (finderror:any, account:any):void => {
                        if (!finderror) {
                            if (account != null) {
                                var account2 = account;
                                account2.username = req.body.username;
                                account2.type = req.body.type;
                                account2.save((saveerror:any):void => {
                                    if (!saveerror) {
                                        res.send(JSON.stringify(new Result(0, "OK", {})));
                                    } else {
                                        res.send(JSON.stringify(new Result(100, "account put", saveerror)));
                                    }
                                });
                            }
                            else {
                                res.send(JSON.stringify(new Result(3, "account put find error", {})));
                            }
                        }
                        else {
                            res.send(JSON.stringify(new Result(100, "account put find error", finderror)));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(1, "account put no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new Result(2, "account put " + message, error)));
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "account put no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "account put " + e.message, e)));
    }
});

/*! delete */
router.delete('/account/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    var id:string = req.params.id;
                    Account.remove({_id: id}, (removeerror:any):void => {
                        if (!removeerror) {
                            res.send(JSON.stringify(new Result(0, "OK", {})));
                        }
                        else {
                            res.send(JSON.stringify(new Result(100, "account delete", removeerror)));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(1, "account delete no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new Result(2, "account delete " + message, error)));
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "account delete no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "account delete " + e.message, e)));
    }
});

/*! query */
router.get('/account/query/:query', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, (type:any):void => {
                var query:any = JSON.parse(decodeURIComponent(req.params.query));
                Account.find({}, (finderror:any, docs:any):void => {
                    if (!finderror) {
                        if (docs != null) {
                            res.send(JSON.stringify(new Result(0, "OK", docs)));
                        }
                        else {
                            res.send(JSON.stringify(new Result(10, "account query", {})));
                        }
                    } else {
                        res.send(JSON.stringify(new Result(100, "account query", finderror)));
                    }
                });
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new Result(2, "account query " + message, error)));
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "account query no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "account query " + e.message, e)));
    }
});

/*! update */
router.put('/account/password/:id', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    var id:string = req.params.id;
                    Account.findById(id, (finderror:any, account:any):void => {
                        if (!finderror) {
                            if (account != null) {
                                var account2:any = account;
                                account2.password = Cipher(req.body.password, config.key1);
                                account2.save((saveerror:any):void => {
                                    if (!saveerror) {
                                        res.send(JSON.stringify(new Result(0, "OK", {})));
                                    } else {
                                        res.send(JSON.stringify(new Result(100, "account password", saveerror)));
                                    }
                                });
                            }
                            else {
                                res.send(JSON.stringify(new Result(3, "account password find error", {})));
                            }
                        }
                        else {
                            res.send(JSON.stringify(new Result(100, "account password find error", finderror)));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(1, "account password no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new Result(2, "account password " + message, error)));
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "account password no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "account password " + e.message, e)));
    }
});


/*! config */
/*! get */
router.get('/config', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, (type:any):void => {
                res.send(JSON.stringify(new Result(0, "config get", config)));
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new Result(2, "config get auth error", {})));
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "config get no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "config get " + e.message, e)));
    }
});

/*! update */
router.put('/config', (req:any, res:any):void => {
    try {
        if (req.session != null) {
            res = BasicHeader(res, "");
            Authenticate(req.session.key, (type:any):void => {
                if (type != "Viewer") {
                    config = req.body.body;
                    fs.writeFile('config/config.json', JSON.stringify(config), (error:any):void => {
                        if (!error) {
                            res.send(JSON.stringify(new Result(0, "config put", config)));
                        }
                        else {
                            res.send(JSON.stringify(new Result(1, "config put write error.", error)));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(1, "config put no rights", {})));
                }
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new Result(2, "config put " + message, error)));
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "config put no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "config put " + e.message, e)));
    }
});

/*! get view */
router.get('/view', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        View.find({}, (finderror:any, doc:any):void => {
            if (!finderror) {
                if (doc != null) {
                    res.send(JSON.stringify(new Result(0, "OK", doc)));
                }
                else {
                    res.send(JSON.stringify(new Result(10, "view get", {})));
                }
            }
            else {
                res.send(JSON.stringify(new Result(100, "view get", finderror)));
            }
        });
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "view get " + e.message, e)));
    }
});

/*! create view */
router.post('/view', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            var view:any = new View();
            var data:any = req.body.data;
            var viewdata:any = JSON.parse(data);
            view.Data = viewdata;
            view.save((saveerror:any):void => {
                if (!saveerror) {
                    res.send(JSON.stringify(new Result(0, "OK", {})));
                } else {
                    res.send(JSON.stringify(new Result(100, "view create", saveerror)));
                }
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "view create no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "view create" + e.message, e)));
    }
});


/*! create view */
router.get('/initview', (req:any, res:any):void => {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            GetView(():void => {
                var view:any = new View();
                view.Data = initView.Data;
                view.save((saveerror:any):void => {
                    if (!saveerror) {
                        res.send(JSON.stringify(new Result(0, "OK", {})));
                    } else {
                        res.send(JSON.stringify(new Result(100, "view create", saveerror)));
                    }
                });
            }, (message:string, error:any):void => {
                res.send(JSON.stringify(new Result(10, "view create" + message, error)));
            });
        }
        else {
            res.send(JSON.stringify(new Result(2000, "view create no session", {})));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(10000, "view create" + e.message, e)));
    }
});

var initView:any = {
    Data: {
        内科: [
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
                ]
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
                        class: "md-accent"
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
                ]
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
                ]
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
                ]
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
                ]
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
                ]
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
                ]
            }
        ],
        整形外科: [
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
                ]
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
                ]
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
                ]
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
                ]
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
                ]
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
                ]
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
                ]
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
                ]
            }
        ],
        耳鼻いんこう科: [],
        小児科: []
    }
};
