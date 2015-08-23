/**
 index.ts
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
var phantom = require('phantom');

var Patient = require('./patient');
var Account = require('./account');

var View = require('./view');

var ToHtml = require('./tohtml');

var csurf = require('csurf');
var crypto = require("crypto");

var passport = require('passport');

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

User(
    "root",
    ():void => {
        Account.register(new Account({username: config.user, type: "Admin"}),
            config.password,
            function (error, account) {
                if (!error) {
                }
            });
    },
    (message:string, error:any):void => {
    }
);

View.count({}, (counterror:any, count:number):void => {
    if (!counterror) {
        if (count <= 0) {
            var ev = new emitter;
            ev.on("view", function (data) {
                var view = new View();
                view.Name = data.Name;
                view.Pages = data.Pages;
                view.save(function (error) {
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

function DeCipher(name:any, password:any):any {
    var decipher:any = crypto.createDecipher('aes192', password);
    var decrypted = decipher.update(name, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
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
    response.contentType('application/json');
    return response;
}

function Guard(req:any, res:any, callback:(req:any, res:any) => void, message:string):void {
    try {
        res = BasicHeader(res, "");
        callback(req, res);
    } catch (e) {
        SendResult(res, 100000, message, e);
    }
}

function Authenticate(req:any, res:any, code:number, callback:(user:any, res:any) => void, message:string):void {
    if (req.user) {
        callback(req.user, res);
    } else {
        SendResult(res, code + 2, message, {});
    }
}

function FindById(res:any, code:number, model:any, id:any, callback:(res:any, object:any) => void):void {
    model.findById(id, (error:any, object:any):void => {
        if (!error) {
            if (object) {
                callback(res, object);
            } else {
                SendResult(res, code + 10, "", {});
            }
        } else {
            SendResult(res, code + 100, "", error);
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

function FindOne(res:any, code:number, model:any, query:any, callback:(res:any, object:any) => void):void {
    model.findOne(query, (error:any, doc:any):void => {
        if (!error) {
            callback(res, doc);
        } else {
            SendResult(res, code + 100, "", error);
        }
    });
}

function Find(res:any, code:number, model:any, query:any, count:any, sort:any, callback:(res:any, object:any) => void):void {
    model.find(query, count, sort, (error:any, docs:any):void => {
        if (!error) {
            if (docs) {
                callback(res, docs);
            } else {
                SendResult(res, code + 10, "", {});
            }
        } else {
            SendResult(res, code + 100, "", error);
        }
    });
}

function Save(res:any, code:number, instance:any, callback:(res:any, object:any) => void):void {
    instance.save((error:any):void => {
        if (!error) {
            callback(res, instance);
        } else {
            SendResult(res, code + 100, "", error);
        }
    });
}

function Remove(res:any, code:number, model:any, id:any, callback:(res:any) => void):void {
    model.remove({_id: id}, (error:any):void => {
        if (!error) {
            callback(res);
        } else {
            SendResult(res, code + 100, "", error);
        }
    });
}

function If(res:any, code:number, condition:boolean, callback:(res:any) => void):void {
    if (condition) {
        callback(res);
    } else {
        SendResult(res, code + 1, "", {});
    }
}

function SendResult(res:any, code:number, message:any, object:any):void {
    res.send(JSON.stringify(new result(code, message, object)));
}

router.get('/', (req:any, res:any):void => {
    res.render('index', {state: config.state});
});

router.get('/document/:id', (req:any, res:any):void => {
    Patient.findById(req.params.id, (finderror:any, patient:any):void => {
        if (!finderror) {
            if (patient) {
                res.render('document/index', {patient: patient});
            } else {

            }
        } else {

        }
    });
});

router.get('/partials/logo', (req:any, res:any, next:Function):void => {
    res.render('partials/logo');
});

router.get('/backend/', (req:any, res:any):void => {
    res.render('backend/index', {state: config.state});
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


router.get('/backend/partials/edit/item/text/textcreatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/text/textcreatedialog');
});

router.get('/backend/partials/edit/item/check/checkcreatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/check/checkcreatedialog');
});

router.get('/backend/partials/edit/item/select/selectcreatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/select/selectcreatedialog');
});

router.get('/backend/partials/edit/item/numeric/numericcreatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/numeric/numericcreatedialog');
});

router.get('/backend/partials/edit/item/picture/picturecreatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/picture/picturecreatedialog');
});

router.get('/backend/partials/edit/item/button/buttoncreatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/button/buttoncreatedialog');
});


router.get('/backend/partials/edit/item/text/textupdatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/text/textupdatedialog');
});

router.get('/backend/partials/edit/item/check/checkupdatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/check/checkupdatedialog');
});

router.get('/backend/partials/edit/item/select/selectupdatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/select/selectupdatedialog');
});

router.get('/backend/partials/edit/item/numeric/numericupdatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/numeric/numericupdatedialog');
});

router.get('/backend/partials/edit/item/picture/pictureupdatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/picture/pictureupdatedialog');
});

router.get('/backend/partials/edit/item/button/buttonupdatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/button/buttonupdatedialog');
});


router.get('/backend/partials/edit/item/text/textdeletedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/text/textdeletedialog');
});

router.get('/backend/partials/edit/item/check/checkdeletedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/check/checkdeletedialog');
});

router.get('/backend/partials/edit/item/select/selectdeletedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/select/selectdeletedialog');
});

router.get('/backend/partials/edit/item/numeric/numericdeletedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/numeric/numericdeletedialog');
});

router.get('/backend/partials/edit/item/picture/picturedeletedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/picture/picturedeletedialog');
});

router.get('/backend/partials/edit/item/button/buttondeletedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/item/button/buttondeletedialog');
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
    res.render('front/index', {state: config.state});
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
    Guard(req, res, (req:any, res:any):void => {
        var patient:any = new Patient();
        patient.Information = req.body.Information;
        patient.Date = new Date();
        patient.Category = req.body.Category;
        //patient.Sequential = req.body.Sequential;

        //    var now =  patient.Date;

        //    var hour =  ("0"+ now.getHours()).slice(-2); // 時
        //    var min = ("0"+ now.getMinutes()).slice(-2); // 時 ;
        //    var sec = ("0"+ now.getSeconds()).slice(-2); // 時 ;

        //    patient.Information.time = hour + ":" + min + ":" + sec;

        //t0S　ーーhoke
        //t01 --なまえ

        //同時に同名でないこと（自動Accept対策)
        var query = {"$and": [{'Information.name': patient.Information.name}, {'Information.time': patient.Information.time}]};
        Find(res, 1000, Patient, query, {}, {}, (res:any, docs:any) => {
            if (docs.length == 0) {
                patient.Status = req.body.Status;
                patient.Input = req.body.Input;
                patient.Sequential = req.body.Sequential;
                Save(res, 1000, patient, (res:any, patient:any) => {
                    SendResult(res, 0, "OK", patient.Status);
                });
            } else {
                SendResult(res, 1000+10, "", {});
            }
        });
    }, "patient accept ");
});

/*! get */
router.get('/patient/:id', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 2000, (user:any, res:any) => {
            FindById(res, 2000, Patient, req.params.id, (res, patient) => {
                SendResult(res, 0, "OK", patient);
            });
        }, "");
    }, "patient get e.message");
});

/*! update */
router.put('/patient/:id', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 2000, (user:any, res:any) => {
            FindById(res, 3000, Patient, req.params.id, (res, patient) => {
                patient.Status = req.body.Status;
                patient.Input = req.body.Input;
                patient.Sequential = req.body.Sequential;
                Save(res, 3000, patient, (res:any, patient:any) => {
                    SendResult(res, 0, "OK", patient);
                });
            });
        }, "");
    }, "atient put");
});

/*! delete */
router.delete('/patient/:id', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 4000, (user:any, res:any) => {
            If(res, 4000, (user.type != "Viewer"), (res:any) => {
                Remove(res, 4000, Patient, req.params.id, (res:any) => {
                    SendResult(res, 0, "OK", {});
                });
            });
        }, "");
    }, "atient delete");
});

/*! query */
router.get('/patient/query/:query', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 5000, (user:any, res:any) => {
            var query = JSON.parse(decodeURIComponent(req.params.query));
            Find(res, 5000, Patient, query, {}, {sort: {Date: -1}}, (res:any, docs:any):any => {
                SendResult(res, 0, "OK", docs);
            });
        }, "");
    }, "patient query");
});

/*! query */
router.get('/patient/count/:query', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 2000, (user:any, res:any) => {
            var query = JSON.parse(decodeURIComponent(req.params.query));
            Patient.count(query, (error:any, docs:any):void => {
                if (!error) {
                    if (docs) {
                        SendResult(res, 0, "OK", docs);
                    } else {
                        SendResult(res, 0, "OK", 0);
                    }
                } else {
                    SendResult(res, 6000 + 100, "", error);
                }
            });
        }, "");
    }, "patient query");
});

/*! status */
router.get('/patient/status/:id', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 2000, (user:any, res:any) => {
            FindById(res, 7000, Patient, req.params.id, (res, patient) => {
                SendResult(res, 0, "OK", patient.Status);
            });
        }, "");
    }, "patient status get");
});

router.put('/patient/status/:id', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 8000, (user:any, res:any) => {
            If(res, 8000, (user.type != "Viewer"), (res:any) => {
                FindById(res, 8000, Patient, req.params.id, (res, patient) => {
                    patient.Status = req.body.Status;
                    Save(res, 8000, patient, (res:any, patient:any) => {
                        SendResult(res, 0, "OK", patient.Status);
                    });
                });
            });
        }, "");
    }, "patient status put");
});

/*! account */
/*! create */
router.post('/account/create', (request:any, response:any):void => {
    Guard(request, response, (request:any, response:any) => {
        var username = request.body.username;
        var password = request.body.password;
        var type = request.body.type;
        Authenticate(request, response, 2000, (user:any, res:any) => {
            If(res, 9000, (user.type != "Viewer"), (res:any) => {
                FindOne(res, 9000, Account, {username: request.body.username.toLowerCase()}, (res:any, account:any) => {
                    if (!account) {
                        Account.register(new Account({username: username, type: request.body.type}),
                            password,
                            function (error, account) {
                                if (!error) {
                                    SendResult(res, 0, "OK", account);
                                }
                            });
                    } else {
                        SendResult(res, 1, "Already found", {});
                    }
                });
            });
        }, "");
    }, "account create");
});

/*! logout */
router.post('/account/logout', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        req.logout();
        SendResult(res, 0, "OK", {});
    }, "account logout");
});

/*! login */
router.post('/account/login', function (request, response, next) {
    passport.authenticate('local', function (error, user, info) {
        try {
            if (!error) {
                if (user) {
                    request.login(user, function (error) {
                        if (!error) {
                            SendResult(response, 0, "OK", user);
                        } else {
                            SendResult(response, 10000 + 1, "", {});
                        }
                    });
                } else {
                    SendResult(response, 10000 + 2, "", {});
                }
            } else {
                SendResult(response, 10000 + 3, "", {});
            }
        } catch (e) {
            SendResult(response, 100000, e.message, e);
        }
    })(request, response, next);
});

/*! get */
router.get('/account/:id', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 11000, (user:any, res:any) => {
            FindById(res, 11000, Account, req.params.id, (res, account) => {
                SendResult(res, 0, "OK", account);
            });
        }, "");
    }, "account get");
});

/*! update */
router.put('/account/:id', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 12000, (user:any, res:any) => {
            If(res, 12000, (user.type != "Viewer"), (res:any) => {
                FindById(res, 12000, Account, req.params.id, (res, account) => {
                    var account2 = account;
                    account2.username = req.body.username;
                    account2.type = req.body.type;
                    Save(res, 12000, account2, (res:any, account:any) => {
                        SendResult(res, 0, "OK", account);
                    });
                });
            });
        }, "");
    }, "account put");
});

/*! delete */
router.delete('/account/:id', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 13000, (user:any, res:any) => {
            If(res, 13000, (user.type != "Viewer"), (res:any) => {
                Remove(res, 13000, Account, req.params.id, (res:any) => {
                    SendResult(res, 0, "OK", {});
                });
            });
        }, "");
    }, "account delete");
});

/*! query */
router.get('/account/query/:query', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 14000, (user:any, res:any) => {
            var query:any = JSON.parse(decodeURIComponent(req.params.query));
            Find(res, 14000, Account, query, {}, {}, (res:any, docs:any) => {
                SendResult(res, 0, "OK", docs);
            });
        }, "");
    }, "account query");
});

/*! update */
router.put('/account/password/:id', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 15000, (user:any, res:any) => {
            If(res, 15000, (user.type != "Viewer"), (res:any) => {
                FindById(res, 15000, Account, req.params.id, (res, account) => {
                    account.setPassword(req.body.password, function (error) {
                        if (!error) {
                            Save(res, 15000, account, (res:any, account:any) => {
                                SendResult(res, 0, "OK", account);
                            });
                        } else {
                            SendResult(res, 15000 + 200, "", error);
                        }
                    });
                });
            });
        }, "");
    }, "account password");
});

/*! config */
/*! get */
router.get('/config', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 2000, (user:any, res:any) => {
            SendResult(res, 0, "OK", config);
        }, "");
    }, "config get");
});

/*! update */
router.put('/config', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 17000, (user:any, res:any) => {
            If(res, 17000, (user.type != "Viewer"), (res:any) => {
                config = req.body.body;
                fs.writeFile('config/config.json', JSON.stringify(config), (error:any):void => {
                    if (!error) {
                        SendResult(res, 0, "OK", config);
                    } else {
                        SendResult(res, 17000 + 1, "", error);
                    }
                });
            });
        }, "");
    }, "config put");
});

/*! views */
/*! create view */
router.post('/view', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        var view:any = new View();
        var data:any = req.body.data;
        var viewdata:any = JSON.parse(data);
        view.Pages = viewdata.Pages;
        view.Name = viewdata.Name;
        Save(res, 18000, view, (res:any, view:any) => {
            SendResult(res, 0, "OK", view);
        });
    }, "config create");
});

router.post('/view/create', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 19000, (user:any, res:any) => {
            If(res, 19000, (user.type != "Viewer"), (res:any) => {
                View.count({Name: req.body.Name}, (error:any, count:number):void => {
                    if (!error) {
                        if (count == 0) {
                            var view:any = new View();
                            view.Name = req.body.Name;
                            view.Pages = [];
                            Save(res, 19000, view, (res:any, view:any) => {
                                SendResult(res, 0, "OK", view);
                            });
                        } else {
                            SendResult(res, 19000 + 1, "", {});
                        }
                    } else {
                        SendResult(res, 19000 + 20, "", error);
                    }
                });
            });
        }, "");
    }, "view create");
});

/*! get view */
router.get('/view/:id', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        FindById(res, 20000, View, req.params.id, (res, view) => {
            SendResult(res, 0, "OK", view);
        });
    }, "view get");
});

/*! update */
router.put('/view/:id', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 21000, (user:any, res:any) => {
            If(res, 21000, (user.type != "Viewer"), (res:any) => {
                FindById(res, 21000, View, req.params.id, (res, view) => {
                    view.Name = req.body.Name;
                    view.Pages = req.body.Pages;
                    Save(res, 21000, view, (res:any, object:any) => {
                        SendResult(res, 0, "OK", view);
                    });
                });
            });
        }, "");
    }, "view put");
});

/*! delete */
router.delete('/view/:id', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 22000, (user:any, res:any) => {
            If(res, 22000, (user.type != "Viewer"), (res:any) => {
                Remove(res, 22000, View, req.params.id, (res:any) => {
                    SendResult(res, 0, "OK", {});
                });
            });
        }, "");
    }, "view delete");
});

/*! query */
router.get('/view/query/:query', (req:any, res:any):void => {
    Guard(req, res, (req:any, res:any) => {
        Authenticate(req, res, 23000, (user:any, res:any) => {
            var query:any = JSON.parse(decodeURIComponent(req.params.query));
            Find(res, 23000, View, {}, {}, {}, (res:any, views:any) => {
                SendResult(res, 0, "OK", views);
            });
        }, "");
    }, "view query");
});

/*! PDF */
router.get('/pdf/:id', function (request, response, next) {
    try {
        response.header('Content-type', 'application/pdf');
        var id:string = request.params.id;
        phantom.create(function (ph) {
            ph.createPage(function (page) {
                page.set('viewportSize', {width: 1200, height: 1200}, function (err) {
                    page.open("http://localhost:3000/document/" + id, function (error, status) {
                        page.render("public/output/output" + id + ".pdf", function (error) {
                            if (!error) {
                                ph.exit();
                                SendResult(response, 0, "OK", "output" + id + ".pdf");
                            }
                            else {
                                SendResult(response, 24000 + 1, "", error);
                            }
                        });
                    });
                });
            });
        });
    }
    catch (e) {
        response.send(JSON.stringify(new result(100000, "exception " + e.message, e)));
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
