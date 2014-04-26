var entities = require('./entities.js');

function Game(config) {
    config = config || {};
    var self = this;

    self.planets = config.planets || [];
    if (self.planets.length == 0) {
        self.planets.push(new entities.Planet());
    }
};

exports.game = new Game();