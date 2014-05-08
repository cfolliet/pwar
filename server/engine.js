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

    init();

    function init() {
        // init planets map
        // TODO choose the way we get the map (random generate/save in db)
        if (self.planets.length == 0) {
            self.planets.push(new entities.Planet());
            self.planets.push(new entities.Planet());
        }
    };

    function addPlayer(name) {
        var player = new entities.Player({ name: name });
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
            self.isStarted = true;
            setInterval(planetsGrowth, 3000);
        }
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
            planet.shipCount += parseInt(planet.size / 10);
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