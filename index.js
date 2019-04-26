
const express = require('express');
const http = require('http');
const path = require('path');
const io = require('socket.io');
const { StringDecoder } = require('string_decoder');

const app = express();
const server = http.createServer(app);
const listen = io.listen(server);
let users = [];
let connections = [];

// initialize server
server.listen(7777);
console.log('server online');


// response to get requests
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(path.join(__dirname, 'build')));


// on io connect 
listen.sockets.on('connection', socket => {
    connections.push(socket);
    console.log(`${connections.length} sockets connected`);

    //disconnect
    socket.on('disconnect', (data) => {
        connections.splice(connections.indexOf(socket), 1);
        users.splice(users.map(function (e) { return e.id; }).indexOf(socket.username), 1);
        console.log(`${connections.length} sockets connected`);
        console.log(users);
    });

    //on msg recived -> send msg to everyone
    socket.on('send-msg', data => {
        let index = connections.map(function (e) { return e.username; }).indexOf(data.to);
        let msg = { msg: data.msg, uid: socket.username };
        connections[index].emit('new-msg', msg);

        // let decoder = new StringDecoder('utf8');
        // console.log(socket.username + ': ' + decoder.write(data.msg.m));
    });

    socket.on('new-user', data => {
        socket.username = data;
        let newUser = { id: data, lookingForChat: false };
        users.push(newUser);
        console.log(users);
    });

    socket.on('chat-request', data => {
        let index = users.map(function (e) { return e.id; }).indexOf(data);
        users[index].lookingForChat = true;
        console.log(users);
        let partner = match(socket.username);

        if (partner) {
            let partnerIndex = connections.map(function (e) { return e.username; }).indexOf(partner);
            connections[partnerIndex].emit("new-partner", data);
            socket.emit("new-partner", partner);
        }

    });

    socket.on('got-partner', (id) => {
        let index = users.map(function (e) { return e.id; }).indexOf(id);
        users[index].lookingForChat = false;
        console.log(users);
    });

    function match(id) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].id != id && users[i].lookingForChat) {
                return users[i].id;
            }
        }

    }


    socket.on('dh-send', data => {
        let index = connections.map(function (e) { return e.username; }).indexOf(data.to);
        connections[index].emit('dh-get', data.key);
    });

});


