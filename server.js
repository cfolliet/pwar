var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var socketIo = require('socket.io');
var engine = require('./server/engine.js');

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
})
.post(function (req, res) {
    var gameName = req.body.name;
    var playerName = req.body.playerName;
    var game = engine.createGame(gameName, playerName);
    game.on('endMove', updateGame);
    game.on('planetsGrowth', updateGame);
    res.send(game);
    updateGames(engine.games);
});

app.route('/players')
.post(function (req, res) {
    var gameId = req.body.gameId;
    var playerName = req.body.name;
    var game = engine.getGame(gameId);
    game.addPlayer(playerName);
    res.send(game);
    updateGame(game);
})
.put(function (req, res) {
    var gameId = req.body.gameId;
    var playerId = req.body.playerId;
    var game = engine.getGame(gameId);
    game.setReady(playerId);
    res.send(game);
    updateGame(game);
});

app.route('/moves')
.post(function (req, res) {
    // todo get the game to use code below
    //res.send(game.addMove(req.body.startPlanetId, req.body.endPlanetId, parseInt(req.body.shipCount)));
    //updateGame();
});

io.sockets.on('connection', function (socket) {
    updateGames(engine.games);
});

function updateGames(games) {
    io.sockets.emit('games', games);
};

function updateGame(game) {
    io.sockets.emit('game', game);
};

server.listen(8080);
console.log('Server is running...');