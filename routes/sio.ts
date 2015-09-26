/**
 sio.ts
 Copyright (c) 2015 7ThCode.
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
 */

'use strict';

declare function require(x: string): any;

// Socket.IO
var socketio = require('socket.io');

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

module.exports = sio;