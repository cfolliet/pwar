var entities = require('./entities.js');

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
            self.planets.push(new entities.Planet());
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
    throw new Error('not implemented');
};

exports.game = new Game();