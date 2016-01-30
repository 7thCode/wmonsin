/**
 index.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

'use strict';

declare function require(x:string):any;

function alert_log(obj:any, name:string):void {
    if (obj) {
        logger.info(name + ' Ok.');
    } else {
        logger.fatal(name + ' NG.');
    }
}

var express = require('express');
var emitter = require('events').EventEmitter;

var fs = require('fs');

var text = fs.readFileSync('config/config.json', 'utf-8');
var config = JSON.parse(text);

var log4js = require('log4js');
log4js.configure("config/logs.json");
var logger = log4js.getLogger('request');
logger.setLevel(config.loglevel);

alert_log(express,'express');
alert_log(emitter,'emitter');

var mongoose = require('mongoose');
alert_log(mongoose,'mongoose');

var Grid = require('gridfs-stream');
alert_log(Grid,'Grid');

var _ = require('lodash');
alert_log(_,'lodash');

alert_log(fs,'fs');
alert_log(config,'config');

config.dbaddress = process.env.DB_PORT_27017_TCP_ADDR || config.dbaddress;
if (config.dbaddress) {
    logger.info('config.dbaddress : ' + config.dbaddress);
} else {
    logger.fatal('config.dbaddress NG.');
}

var PatientModel = require('./../model/patient');
alert_log(PatientModel,'PatientModel');


var AccountModel = require('./../model/account');
alert_log(AccountModel,'AccountModel');

var ViewModel = require('./../model/view');
alert_log(ViewModel,'ViewModel');

var FileModel = require('./../model/file');
alert_log(FileModel,'FileModel');

var ToHtml = require('./lib/tohtml');
alert_log(ToHtml,'ToHtml');

//var csurf = require('csurf');
//var crypto = require("crypto");

var passport = require('passport');
alert_log(passport,'passport');


var router = express.Router();

var Settings = require('./settings');
alert_log(log4js,'log4js');

//var formatpdf = require('./lib/formatpdf');
var result = require('./lib/result');
alert_log(log4js,'log4js');

var AccountController = require('./controllers/account_controller');
alert_log(AccountController,'AccountController');

var PatientController = require('./controllers/patient_controller');
alert_log(log4js,'log4js');

var ViewController = require('./controllers/view_controller');
alert_log(ViewController,'ViewController');

var FileController = require('./controllers/file_controller');
alert_log(FileController,'FileController');

var PdfController = require('./controllers/pdf_controller');
alert_log(PdfController,'PdfController');

var ConfigController = require('./controllers/config_controller');
alert_log(ConfigController,'ConfigController');

var Wrapper = require('./lib/wrapper');
var wrapper = new Wrapper;
alert_log(wrapper,'wrapper');

var account_controller = new AccountController();
alert_log(account_controller,'account_controller');

var partient_controller = new PatientController();
alert_log(partient_controller,'partient_controller');

var view_controller = new ViewController();
alert_log(view_controller,'view_controller');

var file_controller = new FileController();
alert_log(file_controller,'file_controller');

var pdf_controller = new PdfController();
alert_log(pdf_controller,'pdf_controller');

var config_controller = new ConfigController();
alert_log(config_controller,'config_controller');

logger.info('Index.js Start.');


//var emitter = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });
//non csrf
//router.get('/', function (req, res, next) {
//    res.render('/');
//});

//csrf

module.exports = router;

// init db data
try {
    // root user
    wrapper.FindOne(null, 1000, AccountModel, {username: "root"}, (res:any, account:any):void => {
        if (!account) {
            logger.trace("Creating init user");
            AccountModel.register(new AccountModel({username: config.user, type: "Admin"}),
                config.password,
                function (error, account) {
                    if (!error) {
                        logger.trace("Created");
                    } else {
                        logger.trace("Error");
                    }
                });
        }
    });

    // init schema
    var connection = "mongodb://" + config.dbuser + ":" + config.dbpassword +  "@" + config.dbaddress +  "/" + config.dbname;

    var conn = mongoose.createConnection(connection);
    if (conn) {
        conn.once('open', (error:any):void  => {
            if (!error) {
                var gfs = Grid(conn.db, mongoose.mongo);
                if (gfs) {
                    conn.db.collection('fs.files', (error:any, collection:any):void => {
                        if (!error) {
                            if (collection) {
                                collection.findOne({filename: "schema1.png"}, (error:any, item:any):void => {
                                    if (!error) {
                                        if (!item) {
                                            logger.trace("Creating init schema");
                                            var readstream = fs.createReadStream('public/images/schema1.png');
                                            var writestream = gfs.createWriteStream({filename: "schema1.png"});
                                            if (writestream) {
                                                readstream.pipe(writestream);
                                                writestream.on('close', (file:any):void => {
                                                    conn.db.close();
                                                    logger.trace("Created");
                                                });
                                            } else {
                                                logger.error("Created schema writestream");
                                            }
                                        }
                                    } else {
                                        logger.error("Created schema find");
                                    }
                                });
                            } else {
                                logger.error("Created schema connection");
                            }
                        } else {
                            logger.error("Created schema collection");
                        }
                    });
                } else {
                    logger.error("Created schema gfs");
                }
            } else {
                logger.error("Created schema open");
            }
        });
    }

    // init view
    ViewModel.count({}, (counterror:any, count:number):void => {
        if (!counterror) {
            if (count <= 0) {
                logger.trace("Creating init View");
                var ev = new emitter;
                ev.on("view", function (data) {
                    var view = new ViewModel();
                    view.Name = data.Name;
                    view.Pages = data.Pages;
                    view.save(function (error) {
                        logger.trace("Created init View");
                    });
                });

                var config = new Settings;
                var views = config.initView.Views;
                _.each(views, function (data, index) {
                    ev.emit("view", data);
                });
            }
        } else {
            logger.error("count open");
        }
    });
}
catch (e) {
    logger.fatal("init");
}

/*
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
*/

router.get('/', (req:any, res:any):void => {
    res.render('index', {development:(config.state === "development")});
});

router.get('/document/:id', (req:any, res:any, next:any):void => {
    PatientModel.findById(req.params.id, (finderror:any, patient:any):void => {
        if (!finderror) {
            if (patient) {
                res.render('document/index', {patient: patient});
            } else {
                logger.error("/document/:id 1");
                next();
            }
        } else {
            logger.error("/document/:id 2");
            next();
        }
    });
});

router.get('/partials/logo', (req:any, res:any, next:Function):void => {
    res.render('partials/logo');
});

router.get('/backend/', (req:any, res:any):void => {
    res.render('backend/index', {development: (config.state === "development")});
});

router.get('/backend/partials/patient/start', (req:any, res:any):void => {
    res.render('backend/partials/patient/start');
});

router.get('/backend/partials/patient/patients', (req:any, res:any):void => {
    res.render('backend/partials/patient/patients');
});

router.get('/backend/partials/patient/description/:id', (req:any, res:any, next:any):void => {
    var id = req.params.id;
    PatientModel.findById(id, (error:any, patient:any):void => {
        if (!error) {
            if (patient) {
                res.render('backend/partials/patient/description', {patient: patient});
            } else {
                logger.error("/backend/partials/patient/description/:id 1");
                next();
            }
        } else {
            logger.error("/backend/partials/patient/description/:id 2");
            next();
        }
    });
});

router.get('/backend/partials/patient/patientacceptdialog', (req:any, res:any):void => {
    res.render('backend/partials/patient/patientacceptdialog');
});

router.get('/backend/partials/patient/sheet', (req:any, res:any):void => {
    res.render('backend/partials/patient/sheet');
});

router.get('/backend/partials/patient/totalsheet', (req:any, res:any):void => {
    res.render('backend/partials/patient/totalsheet');
});

router.get('/backend/partials/patient/configsheet', (req:any, res:any):void => {
    res.render('backend/partials/patient/configsheet');
});

/*! partials */
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

/*! edit dialog */
router.get('/backend/partials/edit/departmentcreatedialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/departmentcreatedialog');
});

router.get('/backend/partials/edit/departmentcopydialog', (req:any, res:any):void => {
    res.render('backend/partials/edit/departmentcopydialog');
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

/* */
router.get('/backend/partials/edit/departments', (req:any, res:any):void => {
    res.render('backend/partials/edit/departments');
});

router.get('/backend/partials/edit/department', (req:any, res:any):void => {
    res.render('backend/partials/edit/department');
});

/* */
router.get('/backend/partials/edit/page', (req:any, res:any):void => {
    res.render('backend/partials/edit/page');
});

router.get('/backend/partials/edit/files', (req:any, res:any):void => {
    res.render('backend/partials/edit/files');
});

router.get('/backend/partials/controll/notification', (req:any, res:any):void => {
    res.render('backend/partials/controll/notification');
});

router.get('/backend/partials/controll/panel', (req:any, res:any):void => {
    res.render('backend/partials/controll/panel');
});

/* */
router.get('/backend/partials/error', (req:any, res:any):void => {
    res.render('backend/partials/error');
});

/*! front */
router.get('/front/', (req:any, res:any):void => {
    res.render('front/index', {development: (config.state === "development")});
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
router.post('/patient/accept', partient_controller.post_patient_accept);
router.get('/patient/:id', partient_controller.get_patient_id);
router.put('/patient/:id', partient_controller.put_patient_id);
router.delete('/patient/:id', partient_controller.delete_patient_id);
router.get('/patient/query/:query', partient_controller.get_patient_query_query);
router.get('/patient/count/:query', partient_controller.get_patient_count_query);
router.get('/patient/status/:id', partient_controller.get_patient_status_id);
router.put('/patient/status/:id', partient_controller.put_patient_status_id);
router.put('/patient/information/:id', partient_controller.put_patient_information_id);

router.get('/api/:key/patient/query/:query', partient_controller.get_api_key_patient_query_query);


/*! account */
router.post('/account/create', account_controller.post_account_create);
router.post('/account/logout', account_controller.post_account_logout);
router.post('/account/login', account_controller.post_account_login);
router.get('/account/:id', account_controller.get_account_id);
router.put('/account/:id', account_controller.put_account_id);
router.delete('/account/:id', account_controller.delete_account_id);
router.get('/account/query/:query', account_controller.get_account_query_query);
router.put('/account/password/:id', account_controller.get_account_password_id);

/*! views */
router.post('/view', view_controller.post_view);
router.post('/view/create', view_controller.post_view_create);
router.get('/view/:id', view_controller.get_view_id);
router.put('/view/:id', view_controller.put_view_id);
router.delete('/view/:id', view_controller.delete_view_id);
router.get('/view/query/:query', view_controller.get_view_query_query);

/*! file */
router.get('/file/:name', file_controller.get_file_name);
router.post('/file/:name', file_controller.post_file_name);
router.put('/file/:name', file_controller.put_file_name);
router.delete('/file/:name', file_controller.delete_file_name);
router.get('/file/query/:query', file_controller.get_file_query_query);

/*! pdf */
router.get('/pdf/:id', pdf_controller.get_pdf_id);

/*! config */
router.get('/config', config_controller.get_config);
router.put('/config', config_controller.put_config);

//Test area

router.get('/front/partials/browse2/:name', function (req, res) {

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

    wrapper.GetView(req.params.name, (view:any):void => {
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

logger.info('-----------------------Start---------------------');

//Test area
