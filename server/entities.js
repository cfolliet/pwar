var uuid = require('node-uuid');
var _ = require('underscore');

function Position(x, y) {
    var self = this;

    self.x = x;
    self.y = y;
};

function Planet(config) {
    config = config || {};
    var self = this;

    self.id = config.id || uuid.v4();
    self.position = config.position || new Position(_.random(-500, 500), _.random(-500, 500));

    self.ownerPlayerId = config.ownerPlayerId || null;
    self.size = config.size || _.random(10, 100);
    self.shipCount = config.shipCount || _.random(100);
};

function Player(config) {
    config = config || {};
    var self = this;

    self.id = config.id || uuid.v4();
    self.name = config.name || "no name";
}

function Move(config) {
    config = config || {};
    var self = this;

    self.ownerPlayerId = config.ownerPlayerId;
    self.shipCount = config.shipCount;
    self.startPlanetId = config.startPlanetId;
    self.endPlanetId = config.endPlanetId;
    self.startDate = config.startDate || new Date();
};

exports.Planet = Planet;
exports.Player = Player;
exports.Position = Position;
exports.Move = Move;