var uuid = require('node-uuid');

function Position(x, y) {
    var self = this;

    self.x = x;
    self.y = y;
};

function Planet(config) {
    config = config || {};
    var self = this;

    self.id = config.id || uuid.v4();
    self.position = config.position || new Position(0, 0);

    self.ownerPlayerId = config.ownerPlayerId || null;
    self.maxCapacity = config.maxCapacity || 100;
    self.capacityUsed = config.capacityUsed || 0;
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