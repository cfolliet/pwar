var uuid = require('node-uuid');
var Position = require('/position');

function Position(x, y) {
    var self = this;

    self.x = x;
    self.y = y;
};

function Planet(config) {
    var self = this;

    self.id = config.id || uuid.v4();
    self.position = config.position || new Position(0, 0);

    self.ownerPlayerId = config.ownerPlayerId || null;
    self.maxCapacity = config.maxCapacity || 100;
    self.capacityUsed = config.capacityUsed || 0;
};

exports.Planet = Planet;