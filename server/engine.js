var entities = require('./entities.js');
var _ = require('underscore');

var travelSpeed = 10; // move on x and y axis by minute
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
            self.planets.push(new entities.Planet({ position: new entities.Position(-50, -50) }));
            self.planets.push(new entities.Planet({ position: new entities.Position(50, 50) }));
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

        startPlanet.capacityUsed -= shipCount;

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

        return maxDistance * travelSpeed / 60 / 1000;
    };

    function endMove(move) {
        var endPlanet = getPlanet(move.endPlanetId);

        if (move.ownerPlayerId == endPlanet.ownerPlayerId) {
            endPlanet.capacityUsed = Math.max(endPlanet.capacityUsed + move.shipCount, endPlanet.maxCapacity);
        } else if (endPlanet.capacityUsed > move.shipCount) {
            endPlanet.capacityUsed -= move.shipCount;
        }
        else {
            endPlanet.ownerPlayerId = move.ownerPlayerId;
            endPlanet.capacityUsed = Math.max(Math.abs(endPlanet.capacityUsed - move.shipCount), endPlanet.maxCapacity);
        }
    };
}

exports.game = game;