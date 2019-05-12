
const express = require('express');
const http = require('http');
const path = require('path');
const io = require('socket.io');
const { StringDecoder } = require('string_decoder');

const app = express();
const server = http.createServer(app);
const listen = io.listen(server);
let connections = [];

let port = 7777;
// initialize server
server.listen(port);
console.log('server online on port: ' + port);




function getIndexOfConnection(id) {
    let i = connections.map(function (e) { return e.info.id }).indexOf(id);
    return i;
}

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



    //when user disconnect
    socket.once('disconnect', (data) => {
        if (socket.info) {
            if (socket.info.inChat && socket.info.partner !== -1) {
                let partnerIndex = getIndexOfConnection(socket.info.partner);
                connections[partnerIndex].emit('partner-disconnect');
                connections[partnerIndex].info.inChat = false;
                connections[partnerIndex].info.partner = -1;

            };

            let myIndex = getIndexOfConnection(socket.info.id);
            connections.splice(myIndex, 1);
            console.log(`${connections.length} sockets connected`);
        }



    });
    //on msg recived -> send msg to data.to
    socket.on('send-msg', data => {
        //find index for data.to
        let index = getIndexOfConnection(data.to);
        //construct message
        let msg = { msg: data.msg, uid: socket.info.id };
        //send message 
        if (connections[index]) {
            connections[index].emit('new-msg', msg);
            //decode and log message
            let decoder = new StringDecoder('utf8');
            console.log(socket.info.id + ': ' + decoder.write(data.msg.m));
        } else {
            socket.emit('partner-disconnect');
        }

    });

    //set ID for user- make sure there are no doubles
    function generateUserID() {
        console.log('generating id...');
        let newID;
        do {
            newID = Math.floor(Math.random() * 900000000);
        } while (getIndexOfConnection(newID) !== -1);
        console.log('the id is:' + newID);
        return newID;
    }


    //set new user
    socket.on('new-user', () => {
        //get uid from user. 
        //DOTO: have server send the user thier id- to make sure there are no doubles
        let id = generateUserID();
        console.log(id);
        socket.emit('new-id', id);
        //construct user and add it to socket
        socket.info = { id: id, lookingForChat: false, inChat: false, partner: -1 };

        //add socket to connections
        connections.push(socket);
        console.log(`${connections.length} sockets connected`);
    });


    //when user requests chat
    socket.on('chat-request', data => {

        //set users to looking for chat
        socket.info.lookingForChat = true;
        //try to find a partner
        let partner = findPartner(socket.info.id);

        //if found partner
        if (partner) {
            //get partner index
            let partnerIndex = getIndexOfConnection(partner);
            //set both of them thier partner's id
            connections[partnerIndex].emit("new-partner", data);
            socket.emit("new-partner", partner);
            //set chat and partner for both sides
            socket.info.inChat = true;
            socket.info.partner = partner;
            connections[partnerIndex].info.inChat = true;
            connections[partnerIndex].info.partner = data;


        }

    });
    //when user gets partner set thier lookingForChat to false
    socket.on('got-partner', (id) => {
        let index = getIndexOfConnection(id);
        connections[index].info.lookingForChat = false;
        console.log('');
        console.log(id + ' info: ');
        console.log(connections[index].info);
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
        let shuffledUsers = shuffle(connections);
        for (let i = 0; i < shuffledUsers.length; i++) {
            if (shuffledUsers[i].info.id != id && shuffledUsers[i].info.lookingForChat) {
                console.log("found partner for: " + id + ',\npartner: ' + shuffledUsers[i].info.id);
                return shuffledUsers[i].info.id;
            }
        }

    }


    socket.on('dh-send', data => {
        let index = getIndexOfConnection(data.to);
        connections[index].emit('dh-get', data.key);
    });

    //when user ends the chat
    socket.on('end-chat', data => {

        let partnerIndex = getIndexOfConnection(data);
        connections[partnerIndex].emit('partner-disconnect');
        socket.info.inChat = false;
        socket.info.partner = -1;
        connections[partnerIndex].inChat = false;
        connections[partnerIndex].partner = -1;
    });

});


