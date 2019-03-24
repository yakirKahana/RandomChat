const express = require('express');
const http = require('http');
const io = require('socket.io');

const app = express();
const server = http.createServer(app);
const listen = io.listen(server);
let users = [];
let connections = [];


// initialize server
server.listen(3000);
console.log('server online');


// response to get requests
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});

// on io connect 
listen.sockets.on('connection', socket => {
    connections.push(socket);
    console.log(`${connections.length} sockets connected`);

    //disconnect
    socket.on('disconnect', data => {
        connections.splice(connections.indexOf(socket), 1);
        console.log(`${connections.length} sockets connected`);
    });

    socket.on('send-msg', data => {
        listen.sockets.emit('new-msg', { msg: data });
    });

});