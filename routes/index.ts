/**
 index.js

 Copyright (c) 2015 7ThCode.

 This software is released under the MIT License.

 http://opensource.org/licenses/mit-license.php

 */

/// <reference path="../lib/lib.d.ts" />
/// <reference path="../../DefinitelyTyped/node/node.d.ts" />
/// <reference path="../../DefinitelyTyped/express/express.d.ts" />
/// <reference path="../../DefinitelyTyped/mongoose/mongoose.d.ts" />

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


//var emitter = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });
//non csrf
//router.get('/', function (req, res, next) {
//    res.render('/');
//});

//csrf

router.get('/', function (req, res) {
    // req.session.regenerate(function (err) {
    //     req.session.save(function (err) {
    res.render('/');
    //  res.render('index', {sessionID: req.sessionID});
    //     });
    // });
});


/* GET home page. */
router.get('/front', function (req, res, next) {
    res.render('/front/');
});

router.get('/backend', function (req, res, next) {
    res.render('/backend/');
});

module.exports = router;

class Result {
    private code:number;
    private message:string;
    private value:any;
    private token:any;

    constructor(code:number, message:string, value:any) {
        this.code = code;
        this.message = message;
        this.value = value;
    }
}

User("root", function () {
    var account = new Account();
    account.username = "root";
    account.password = Cipher("root", config.key1);
    account.type = "Admin";
    account.key = Cipher("root", config.key2);
    account.save(function (saveerror) {});
}, function () {});

GetView(function () {
    var view = new View();
    view.Data = initView.Data;
    view.save(function (saveerror) {});
}, function () {});

function Cipher(name, pass) {
    var cipher = crypto.createCipher('aes192', pass);
    cipher.update(name, 'utf8', 'hex');
    return cipher.final('hex');
}

function Authenticate(key, success, error) {
    Account.findOne({key: key}, function (finderror, doc) {
        if (!finderror) {
            if (doc != null) {
                success(doc.type);
            }
            else {
                error();
            }
        }
        else {
            error();
        }
    });
}

function User(name, success, error) {
    Account.findOne({username: name}, function (finderror, doc) {
        if (!finderror) {
            if (doc == null) {
                success();
            }
            else {
                error();
            }
        }
        else {
            error();
        }
    });
}

function BasicHeader(response, session) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Pragma", "no-cache");
    response.header("Cache-Control", "no-cache");
    //  response.header('x-session', session);
    response.contentType('application/json');
    return response;
}


/*! patient */
/*! create */

router.post('/patient/accept', function (req, res) {
    try {
        res = BasicHeader(res, "");
        var patient = new Patient();
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
                    patient.save(function (saveerror) {
                        if (!saveerror) {
                            res.send(JSON.stringify(new Result(0, "", patient.Status)));
                        } else {
                            res.send(JSON.stringify(new Result(10, "patient status put", saveerror)));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(10, "patient query", "null")));
                }
            } else {
                res.send(JSON.stringify(new Result(10, "patient query", finderror)));
            }
        });
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "patient accept", e.message)));
    }
});
/*
 router.post('/patient/create', function (req, res) {
 try {
 res = BasicHeader(res, "");
 var patient = new Patient();
 patient.Input = req.body.body;
 patient.save(function (saveerror) {
 if (!saveerror) {
 res.send(JSON.stringify(new Result(0, "", [])));
 //emitter.emit('client', {value: "1"});
 } else {
 res.send(JSON.stringify(new Result(10, "patient create", saveerror)));
 }
 });
 } catch (e) {
 res.send(JSON.stringify(new Result(100, "patient create", e.message)));
 }
 });
 */
/*! get */
router.get('/patient/:id', function (req, res) {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, function (type) {
                var id = req.params.id;
                Patient.findById(id, function (finderror, doc) {
                    if (!finderror) {
                        if (doc != null) {
                            res.send(JSON.stringify(new Result(0, "", doc)));
                        }
                        else {
                            res.send(JSON.stringify(new Result(10, "patient get", "null")));
                        }
                    }
                    else {
                        res.send(JSON.stringify(new Result(10, "patient get", finderror)));
                    }
                });
            }, function () {
                res.send(JSON.stringify(new Result(2, "patient get", "auth error")));
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "patient get", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "patient get", e.message)));
    }
});

/*! update */
router.put('/patient/:id', function (req, res) {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, function (type) {
                if (type != "Viewer") {
                    var id = req.params.id;
                    Patient.findById(id, function (finderror, patient) {
                        if (!finderror) {
                            if (patient != null) {
                                patient.Status = req.body.Status;
                                patient.Input = req.body.Input;
                                patient.save(function (saveerror) {
                                    if (!saveerror) {
                                        res.send(JSON.stringify(new Result(0, "", 0)));
                                    } else {
                                        res.send(JSON.stringify(new Result(10, "patient put", saveerror)));
                                    }
                                });
                            }
                            else {
                                res.send(JSON.stringify(new Result(10, "patient put", "null")));
                            }
                        }
                        else {
                            res.send(JSON.stringify(new Result(10, "patient put", finderror)));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(1, "patient put", "no rights")));
                }
            }, function () {
                res.send(JSON.stringify(new Result(2, "patient put", "auth error")));
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "patient put", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "patient put", e.message)));
    }
});

/*! delete */
router.delete('/patient/:id', function (req, res) {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, function (type) {
                if (type != "Viewer") {
                    var id = req.params.id;
                    Patient.remove({_id: id}, function (finderror) {
                        if (!finderror) {
                            res.send(JSON.stringify(new Result(0, "", {})));
                        } else {
                            res.send(JSON.stringify(new Result(10, "patient delete", finderror)));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(1, "patient delete", "no rights")));
                }
            }, function () {
                res.send(JSON.stringify(new Result(2, "patient delete", "auth error")));
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "patient delete", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "patient delete", e.message)));
    }
});

/*! query */
router.get('/patient/query/:query', function (req, res) {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, function (type) {

                /*       var params:any = JSON.parse(decodeURIComponent(req.params.query));
                 var today:Date = new Date();
                 today.setHours(23, 59, 59, 99);
                 var yesterday:Date = new Date();
                 yesterday.setHours(0, 0, 0, 1);
                 var query:any = {$and: [{Date: {$lte: today}}, {Date: {$gt: yesterday}}]};
                 */

                var query = JSON.parse(decodeURIComponent(req.params.query));
                /*       var now = new Date();
                 var past = new Date();
                 var baseSec = past.getTime();
                 var pastSec = 86400000;//日数 * 1日のミリ秒数
                 var targetSec = baseSec - pastSec;
                 past.setTime(targetSec);
                 var query:any = {$and: [{Date: {$lte: now}}, {Date: {$gt: past}}]};
                 */

                //      var params:any = JSON.parse(decodeURIComponent(req.params.query));
                //      var today:Date = new Date(params.date);
                //      today.setHours(23, 59, 59, 99);
                //      var yesterday:Date = new Date(params.date);
                //      yesterday.setHours(00, 00, 00, 01);
                //     var query:any = {$and: [{Date: {$lte: today}}, {Date: {$gt: yesterday}}]};


                Patient.find(query, {}, {sort: {Date: -1}}, function (finderror, docs) {
                    if (!finderror) {
                        if (docs != null) {
                            res.send(JSON.stringify(new Result(0, "", docs)));
                        }
                        else {
                            res.send(JSON.stringify(new Result(10, "patient query", "null")));
                        }
                    } else {
                        res.send(JSON.stringify(new Result(10, "patient query", finderror)));
                    }
                });
            }, function () {
                res.send(JSON.stringify(new Result(2, "patient query", "auth error")));
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "patient query", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "patient query", e.message)));
    }
});

/*! status */
router.get('/patient/status/:id', function (req, res) {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, function (type) {

                var id = req.params.id;
                Patient.findById(id, function (finderror, patient) {
                    if (!finderror) {
                        if (patient != null) {
                            res.send(JSON.stringify(new Result(0, "", patient.Status)));
                        }
                        else {
                            res.send(JSON.stringify(new Result(10, "patient status get", "id error")));
                        }
                    }
                    else {
                        res.send(JSON.stringify(new Result(10, "patient status get", finderror)));
                    }
                });

            }, function () {
                res.send(JSON.stringify(new Result(2, "patient status get", "auth error")));
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "patient status get", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "patient status get", e.message)));
    }
});

router.put('/patient/status/:id', function (req, res) {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, function (type) {
                if (type != "Viewer") {
                    var id = req.params.id;
                    Patient.findById(id, function (finderror, patient) {
                        if (!finderror) {
                            if (patient != null) {
                                patient.Status = req.body.Status;
                                patient.save(function (saveerror) {
                                    if (!saveerror) {
                                        res.send(JSON.stringify(new Result(0, "", patient.Status)));
                                    } else {
                                        res.send(JSON.stringify(new Result(10, "patient status put", saveerror)));
                                    }
                                });
                            }
                            else {
                                res.send(JSON.stringify(new Result(10, "patient status put", "null")));
                            }
                        }
                        else {
                            res.send(JSON.stringify(new Result(10, "patient status put", finderror)));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(1, "patient status put", "no rights")));
                }
            }, function () {
                res.send(JSON.stringify(new Result(2, "patient status put", "auth error")));
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "patient status put", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "patient status put", e.message)));
    }
});

/*! account */
/*! create */
router.post('/account/create', function (req, res) {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, function (type) {
                if (type != "Viewer") {
                    User(req.body.username.toLowerCase(), function () {
                        var account = new Account();
                        account.username = req.body.username.toLowerCase();
                        account.password = Cipher(req.body.password, config.key1);
                        account.type = req.body.type;
                        account.key = Cipher(req.body.username, config.key2);
                        account.save(function (saveerror) {
                            if (!saveerror) {
                                res.send(JSON.stringify(new Result(0, "", [])));
                            } else {
                                res.send(JSON.stringify(new Result(10, "account create", saveerror)));
                            }
                        });
                    }, function () {
                        res.send(JSON.stringify(new Result(3, "account create", "already found")));
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(1, "account create", "no rights")));
                }
            }, function () {
                res.send(JSON.stringify(new Result(2, "account create", "auth error")));
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "account create", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "account create", e.message)));
    }
});

/*! logout */
router.post('/account/logout', function (req, res) {
    try {
        res = BasicHeader(res, "");
        req.session.destroy();
        res.send(JSON.stringify(new Result(0, "", {})));
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "account logout", e.message)));
    }
});

/*! login */
router.post('/account/login', function (req, res) {
    try {
        res = BasicHeader(res, "");
        var username = req.body.username;
        var password = Cipher(req.body.password, config.key1);
        var auth = {$and: [{username: username}, {password: password}]};
        Account.findOne(auth, function (finderror, doc) {
            if (!finderror) {
                if (doc != null) {
                    if (req.session == null) {
                        req.session.regenerate(function (err) {
                            req.session.key = doc.key;
                            req.session.save(function (err) {
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
                res.send(JSON.stringify(new Result(10, "unknown user or wrong password.", finderror)));
            }
        });
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "account login fail.", e.message)));
    }
});

/*! get */
router.get('/account/:id', function (req, res) {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, function (type) {
                var id = req.params.id;
                Account.findById(id, function (geterror, doc) {
                    if (!geterror) {
                        if (doc != null) {
                            res.send(JSON.stringify(new Result(0, "", doc)));
                        }
                        else {
                            res.send(JSON.stringify(new Result(10, "account get", "null")));
                        }
                    }
                    else {
                        res.send(JSON.stringify(new Result(10, "account get", geterror)));
                    }
                });
            }, function () {
                res.send(JSON.stringify(new Result(2, "account get", "auth error")));
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "account get", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "account get", e.message)));
    }
});

/*! update */
router.put('/account/:id', function (req, res) {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, function (type) {
                if (type != "Viewer") {
                    var id = req.params.id;
                    Account.findById(id, function (finderror, account) {
                        if (!finderror) {
                            if (account != null) {
                                var account2 = account;
                                account2.username = req.body.username;
                                account2.type = req.body.type;
                                account2.save(function (saveerror) {
                                    if (!saveerror) {
                                        res.send(JSON.stringify(new Result(0, "", 0)));
                                    } else {
                                        res.send(JSON.stringify(new Result(10, "account put", saveerror)));
                                    }
                                });
                            }
                            else {
                                res.send(JSON.stringify(new Result(3, "account put", "find error")));
                            }
                        }
                        else {
                            res.send(JSON.stringify(new Result(3, "account put", "find error")));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(1, "account put", "no rights")));
                }
            }, function () {
                res.send(JSON.stringify(new Result(2, "account put", "auth error")));
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "account put", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "account put", e.message)));
    }
});

/*! delete */
router.delete('/account/:id', function (req, res) {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, function (type) {
                if (type != "Viewer") {
                    var id = req.params.id;
                    Account.remove({_id: id}, function (removeerror) {
                        if (!removeerror) {
                            res.send(JSON.stringify(new Result(0, "", {})));
                        }
                        else {
                            res.send(JSON.stringify(new Result(10, "account delete", removeerror)));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(1, "account delete", "no rights")));
                }
            }, function () {
                res.send(JSON.stringify(new Result(2, "account delete", "auth error")));
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "account delete", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "account delete", e.message)));
    }
});

/*! query */
router.get('/account/query/:query', function (req, res) {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, function (type) {
                var query = JSON.parse(decodeURIComponent(req.params.query));
                Account.find({}, function (finderror, docs) {
                    if (!finderror) {
                        if (docs != null) {
                            res.send(JSON.stringify(new Result(0, "", docs)));
                        }
                        else {
                            res.send(JSON.stringify(new Result(10, "account query", "null")));
                        }
                    } else {
                        res.send(JSON.stringify(new Result(10, "account query", finderror)));
                    }
                });
            }, function () {
                res.send(JSON.stringify(new Result(2, "account query", "auth error")));
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "account query", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "account query", e.message)));
    }
});

/*! update */
router.put('/account/password/:id', function (req, res) {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, function (type) {
                if (type != "Viewer") {
                    var id = req.params.id;
                    Account.findById(id, function (finderror, account) {
                        if (!finderror) {
                            if (account != null) {
                                var account2 = account;
                                account2.password = Cipher(req.body.password, config.key1);
                                account2.save(function (saveerror) {
                                    if (!saveerror) {
                                        res.send(JSON.stringify(new Result(0, "", 0)));
                                    } else {
                                        res.send(JSON.stringify(new Result(10, "account password", saveerror)));
                                    }
                                });
                            }
                            else {
                                res.send(JSON.stringify(new Result(3, "account password", "find error")));
                            }
                        }
                        else {
                            res.send(JSON.stringify(new Result(3, "account password", "find error")));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(1, "account password", "no rights")));
                }
            }, function () {
                res.send(JSON.stringify(new Result(2, "account password", "auth error")));
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "account password", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "account password", e.message)));
    }
});


/*! config */
/*! get */
router.get('/config', function (req, res) {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            Authenticate(req.session.key, function (type) {
                res.send(JSON.stringify(new Result(0, "config get", config)));
            }, function () {
                res.send(JSON.stringify(new Result(2, "config get", "auth error")));
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "config get", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "config get", e.message)));
    }
});

/*! update */
router.put('/config', function (req, res) {
    try {
        if (req.session != null) {
            res = BasicHeader(res, "");
            Authenticate(req.session.key, function (type) {
                if (type != "Viewer") {
                    config = req.body.body;
                    fs.writeFile('config/config.json', JSON.stringify(config), function (err) {
                        res.send(JSON.stringify(new Result(0, "config put", config)));
                    });
                }
                else {
                    res.send(JSON.stringify(new Result(1, "config put", "no rights")));
                }
            }, function () {
                res.send(JSON.stringify(new Result(2, "config put", "auth error")));
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "config put", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "config put", e.message)));
    }
});

/*! get view */
router.get('/view', function (req, res) {
    try {
        res = BasicHeader(res, "");
        View.find({}, function (finderror, doc) {
            if (!finderror) {
                if (doc != null) {
                    res.send(JSON.stringify(new Result(0, "", doc)));
                }
                else {
                    res.send(JSON.stringify(new Result(10, "view get", "null")));
                }
            }
            else {
                res.send(JSON.stringify(new Result(10, "view get", finderror)));
            }
        });
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "view get", e.message)));
    }
});

/*! create view */
router.post('/view', function (req, res) {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            var view = new View();
            var data = req.body.data;
            var viewdata = JSON.parse(data);
            view.Data = viewdata;
            view.save(function (saveerror) {
                if (!saveerror) {
                    res.send(JSON.stringify(new Result(0, "", [])));
                } else {
                    res.send(JSON.stringify(new Result(10, "view create", saveerror)));
                }
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "view create", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "view create", e.message)));
    }
});


function GetView(success, error) {
    View.find({}, {}, {}, function (finderror, docs) {
        if (!finderror) {
            if (docs == null) {
                if (docs.length == 0)
                {
                    success();
                }
                else
                {
                    error();
                }
            }
            else {
                error();
            }
        }
        else {
            error();
        }
    });
}

/*! create view */
router.get('/initview', function (req, res) {
    try {
        res = BasicHeader(res, "");
        if (req.session != null) {
            var view = new View();

            var viewdata = initView.Data;
            view.Data = viewdata;
            view.save(function (saveerror) {
                if (!saveerror) {
                    res.send(JSON.stringify(new Result(0, "", [])));
                } else {
                    res.send(JSON.stringify(new Result(10, "view create", saveerror)));
                }
            });
        }
        else {
            res.send(JSON.stringify(new Result(20, "view create", "no session")));
        }
    } catch (e) {
        res.send(JSON.stringify(new Result(100, "view create", e.message)));
    }
});

var initView = {
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
