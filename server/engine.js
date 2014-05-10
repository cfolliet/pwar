var entities = require('./entities.js');
var events = require('events');
var util = require('util');
var uuid = require('node-uuid');
var _ = require('underscore');

var games = [];

function Game(config) {
    config = config || {};
    var self = this;

    self.id = config.id || uuid.v4();
    self.name = config.name || 'no name';
    self.isStarted = config.isStarted || false;
    self.planets = config.planets || [];
    self.players = config.players || [];
    self.moves = config.moves || [];
    self.addPlayer = addPlayer;
    self.setReady = setReady;
    self.addMove = addMove;

    events.EventEmitter.call(self);

    function addPlayer(name) {
        var color = getAvailableColor();
        var player = new entities.Player({ name: name, color: color });
        self.players.push(player);
        return player;
    };

    function setReady(playerId) {
        var player = getPlayer(playerId);
        player.isReady = true;

        var allReady = self.players.every(function (p) {
            return p.isReady;
        });

        if (allReady) {
            startGame();
        }
    };

    function generatePlanets() {
        var attempts = 0;

        for (var i = 0; i < self.players.length * 10; i++) {
            var position = new entities.Position(_.random(50, 750), _.random(50, 550));
            var size = _.random(30, 100)
            var overlap = _.find(self.planets, function (p) {
                var distanceX = Math.abs(p.position.x - position.x);
                var distanceY = Math.abs(p.position.y - position.y);
                var maxDistance = Math.max(distanceX, distanceY);
                return maxDistance <= 50 + size / 2 + 10;
            });

            if (overlap) {
                i--;
                attempts++;
                if (attempts >= 500) {
                    return;
                }
            }
            else {
                self.planets.push(new entities.Planet({ position: position, size : size }));
            }
        }
    }

    function startGame() {
        generatePlanets();

        var planets = _.sample(self.planets, self.players.length);
        self.players.forEach(function (player, index) {
            var planet = planets[index];
            planet.ownerPlayerId = player.id;
            planet.size = 100;
            planet.shipCount = 100;
        });

        self.isStarted = true;
        setInterval(planetsGrowth, 3000);
    };

    function addMove(startPlanetId, endPlanetId, shipCount) {
        var startPlanet = getPlanet(startPlanetId);
        var endPlanet = getPlanet(endPlanetId);

        startPlanet.shipCount -= shipCount;

        var move = new entities.Move({
            ownerPlayerId: startPlanet.ownerPlayerId,
            startPlanetId: startPlanetId,
            endPlanetId: endPlanetId,
            shipCount: shipCount
        });
        var timeTravel = getTimeTravel(startPlanet.position, endPlanet.position);
        setTimeout(endMove, timeTravel, move);
        self.moves.push(move);
        return move;
    };

    function getAvailableColor() {
        var colors = ["blue", "green", "red", "orange", "pink", "violet"];
        return _.difference(colors, self.players.map(function (player) { return player.color; }))[0];
    };

    function getPlayer(id) {
        return _.find(self.players, function (player) {
            return player.id == id;
        });
    };

    function getPlanet(id) {
        return _.find(self.planets, function (planet) {
            return planet.id == id;
        });
    };

    // returns the time to go from pos1 to pos2 in ms
    function getTimeTravel(position1, position2) {
        var distanceX = Math.abs(position1.x - position2.x);
        var distanceY = Math.abs(position1.y - position2.y);
        var maxDistance = Math.max(distanceX, distanceY);

        return maxDistance * 50;
    };

    function endMove(move) {
        var endPlanet = getPlanet(move.endPlanetId);

        if (move.ownerPlayerId == endPlanet.ownerPlayerId) {
            endPlanet.shipCount += move.shipCount;
        } else if (endPlanet.shipCount > move.shipCount) {
            endPlanet.shipCount -= move.shipCount;
        }
        else {
            endPlanet.ownerPlayerId = move.ownerPlayerId;
            endPlanet.shipCount = Math.abs(endPlanet.shipCount - move.shipCount);
        }

        self.moves = _.reject(self.moves, function (m) { return m.id == move.id });
        self.emit('endMove', self);
    };

    function planetsGrowth() {
        self.planets.forEach(function (planet) {
            if (planet.ownerPlayerId != null) {
                planet.shipCount += parseInt(planet.size / 10);
            }
        });
        self.emit('planetsGrowth', self);
    };
}

util.inherits(Game, events.EventEmitter);

function createGame(gameName, playerName) {
    var game = new Game({ name: gameName });
    game.addPlayer(playerName);
    games.push(game);
    return game;
}

function getGame(id) {
    return _.find(games, function (game) {
        return game.id == id;
    });
};

exports.createGame = createGame;
exports.games = games;
exports.getGame = getGame;