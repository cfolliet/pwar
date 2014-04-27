var entities = require('./entities.js');
var _ = require('underscore');

var game = new Game();

function Game(config) {
    config = config || {};
    var self = this;

    self.planets = config.planets || [];
    self.players = config.players || [];
    self.addPlayer = addPlayer;

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
}

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

exports.game = game;