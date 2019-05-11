
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
let chats = [];

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

    //when user disconnect
    socket.once('disconnect', (data) => {
        //remove connection from connections array
        connections.splice(connections.indexOf(socket), 1);

        //get user index in users array
        let index = users.map(function (e) { return e.id; }).indexOf(socket.uid);
        //check if user on chat if so, end chat with partner
        if (users.length > 0) {
            if (users[index]) {
                if (users[index].inChat) {
                    // notify partner
                    let partnerIndex = connections.map(function (e) { return e.uid }).indexOf(users[index].partner);
                    if (connections[partnerIndex]) {
                        connections[partnerIndex].emit('partner-disconnect');
                    }

                    // update partner
                    partnerUsersIndex = users.map(function (e) { return e.id }).indexOf(users[index].partner);
                    if (users[partnerUsersIndex]) {
                        users[partnerUsersIndex].inChat = false;
                        users[partnerUsersIndex].partner = -1;
                    }

                    console.log('')
                    console.log(users);
                }
            }
        }
        //remove user from users array
        users.splice(index, 1);
        //log sockets and users
        console.log(`${connections.length} sockets connected`);
        console.log('');
        console.log(users);
    });


    //on msg recived -> send msg to data.to
    socket.on('send-msg', data => {
        //find index for data.to
        let index = connections.map(function (e) { return e.uid; }).indexOf(data.to);
        //construct message
        let msg = { msg: data.msg, uid: socket.uid };
        //send message 
        if (connections[index]) {
            connections[index].emit('new-msg', msg);
            //decode and log message
            let decoder = new StringDecoder('utf8');
            console.log(socket.uid + ': ' + decoder.write(data.msg.m));
        } else {
            socket.emit('partner-disconnect');
        }



    });

    //set new user
    socket.on('new-user', data => {
        //get uid from user. DOTO: have server send the user thier id- to make sure there are no doubles
        socket.uid = data;
        //construct user
        let newUser = { id: data, lookingForChat: false, inChat: false, partner: -1 };
        // add user to users array
        users.push(newUser);
        console.log('');
        console.log(users);
    });


    //when user requests chat
    socket.on('chat-request', data => {
        //get user's index
        let index = users.map(function (e) { return e.id; }).indexOf(data);
        //set users to looking for chat
        users[index].lookingForChat = true;
        console.log('');
        console.log(users);
        //try to find a partner
        let partner = findPartner(socket.uid);

        //if found partner
        if (partner) {
            //get partner index
            let partnerIndex = connections.map(function (e) { return e.uid; }).indexOf(partner);

            //get userIndex
            let pratnerUserIndex = users.map(function (e) { return e.id; }).indexOf(partner);
            //set both of them thier partner's id
            connections[partnerIndex].emit("new-partner", data);
            socket.emit("new-partner", partner);
            //set chat and partner 
            users[index].inChat = true;
            users[index].partner = partner;
            users[pratnerUserIndex].inChat = true;
            users[pratnerUserIndex].partner = data;


        }

    });
    //when user gets partner set thier lookingForChat to false
    socket.on('got-partner', (id) => {
        let index = users.map(function (e) { return e.id; }).indexOf(id);
        users[index].lookingForChat = false;
        console.log('');
        console.log(users);
    });

    //shuffle array
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    //find partner
    function findPartner(id) {
        //suffle users
        let shuffledUsers = shuffle(users);
        for (let i = 0; i < shuffledUsers.length; i++) {
            if (shuffledUsers[i].id != id && shuffledUsers[i].lookingForChat) {
                return shuffledUsers[i].id;
            }
        }

    }


    socket.on('dh-send', data => {
        let index = connections.map(function (e) { return e.uid; }).indexOf(data.to);
        connections[index].emit('dh-get', data.key);
    });

});


