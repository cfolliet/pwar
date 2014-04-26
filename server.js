var http = require('http');
var express = require('express');
var socketIo = require('socket.io');
var game = require('./server/engine.js').game;

var app = express();
var server = http.createServer(app);
var io = socketIo.listen(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

io.sockets.on('connection', function (socket) {
    socket.emit('planets', game.planets);

    //socket.on('my other event', function (data) {
    //    console.log(data);
    //});
});

server.listen(8080);
console.log('Server is running...');