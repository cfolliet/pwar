var entities = require('./entities.js');
var _ = require('underscore');

var game = new Game();

function Game(config) {
    config = config || {};
    var self = this;

    self.planets = config.planets || [];
    self.players = config.players || [];
    self.moves = config.moves || [];
    self.addPlayer = addPlayer;
    self.addMove = addMove;

    init();

    function init() {
        // init planets map
        // TODO choose the way we get the map (random generate/save in db)
        if (self.planets.length == 0) {
            self.planets.push(new entities.Planet());
            self.planets.push(new entities.Planet());
        }

        // ... future init stuff
    };

    function addPlayer(name) {
        var player = new entities.Player({ name: name });
        self.players.push(player);
        return player;
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
        setTimeout(endMove, getTimeTravel(startPlanet.position, endPlanet.position), move);
        self.moves.push(move);
        return move;
    };

    function getPlayer(id) {
        return _.find(game.players, function (player) {
            return player.id == id;
        });
    };

    function getPlanet(id) {
        return _.find(game.planets, function (planet) {
            return planet.id == id;
        });
    };

    // returns the time to go from pos1 to pos2 in ms
    function getTimeTravel(position1, position2) {
        var distanceX = Math.abs(position1.x - position2.x);
        var distanceY = Math.abs(position1.y - position2.y);
        var maxDistance = Math.max(distanceX, distanceY);

        return maxDistance * 1000;
    };

    function endMove(move) {
        var endPlanet = getPlanet(move.endPlanetId);

        if (move.ownerPlayerId == endPlanet.ownerPlayerId) {
            endPlanet.shipCount = endPlanet.shipCount + move.shipCount;
        } else if (endPlanet.shipCount > move.shipCount) {
            endPlanet.shipCount -= move.shipCount;
        }
        else {
            endPlanet.ownerPlayerId = move.ownerPlayerId;
            endPlanet.shipCount = Math.abs(endPlanet.shipCount - move.shipCount);
        }
    };
}

exports.game = game;