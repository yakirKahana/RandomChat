const express = require('express');
const http = require('http');
const io = require('socket.io');

const app = express();
const server = http.createServer(app);
const listen = io.listen(server);
let users = [];
let connection = [];



server.listen(3000);
console.log('server online');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});