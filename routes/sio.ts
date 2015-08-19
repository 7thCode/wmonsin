/**
 sio.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

//// <reference path="../../DefinitelyTyped/lib.d.ts"/>
/// <reference path="../../DefinitelyTyped/node/node.d.ts" />
/// <reference path="../../DefinitelyTyped/express/express.d.ts" />

'use strict';

// Socket.IO
var socketio = require('socket.io');

module.exports = sio;

function sio(server) {

    var sio = socketio.listen(server);
    //sio.set('transports', ['websocket']);
    sio.sockets.on('connection', function (socket) {
        socket.on('server', function (data) {
            socket.broadcast.emit('client', {
                value: data.value
            });
        });

        socket.on("disconnect", function () {
        });
    });

}