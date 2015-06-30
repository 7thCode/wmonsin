/**
 * Created by oda on 14/11/06.
 */

//// <reference path="../../DefinitelyTyped/lib.d.ts"/>
/// <reference path="../../DefinitelyTyped/node/node.d.ts" />
/// <reference path="../../DefinitelyTyped/express/express.d.ts" />
/// <reference path="../../DefinitelyTyped/mongoose/mongoose.d.ts" />

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
                value : data.value
            });
        });

        socket.on("disconnect", function () {
        });
    });

}