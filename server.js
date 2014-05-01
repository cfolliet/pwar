var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var socketIo = require('socket.io');
var game = require('./server/engine.js').game;

var app = express();
var server = http.createServer(app);
var io = socketIo.listen(server);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

app.route('/games')
.get(function (req, res) {
    res.send(game);
});

app.route('/players')
.post(function (req, res) {
    res.send(game.addPlayer(req.body.name));
    updateClients();
});

app.route('/moves')
.post(function (req, res) {
    res.send(game.addMove(req.body.startPlanetId, req.body.endPlanetId, req.body.shipCount));
    updateClients();
});

io.sockets.on('connection', function (socket) {
    socket.emit('game', game);
});

function updateClients() {
    io.sockets.emit('game', game);
};

setInterval(updateClients, 1000);

server.listen(8080);
console.log('Server is running...');