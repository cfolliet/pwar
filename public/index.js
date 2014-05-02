var pwar = {};

var host = window.location.origin || window.location.protocol + '//' + window.location.host;

// socketIO
(function (pw) {
    pw.socketIO = io.connect(host);

    pw.socketIO.on('game', update);

    /*
    setInterval(getData, 10000);

    function getData() {
        $.get(host + '/games', function (game) {
            update(game);
        });
    };
    */

    function update(game) {
        pw.gameViewModel.game(game);
        pw.debugViewModel.game(game);
        drawGame(game);
        paper.view.draw();
    };
})(pwar);

// debugger
(function (pw) {
    pw.debugViewModel = {
        game: ko.observable()
    };
})(pwar);

// game
(function (pw) {
    pw.gameViewModel = function () {
        var game = ko.observable();

        function sendMoves(startPlanetIds, endPlanetId) {
            startPlanetIds.forEach(function (startPlanetId) {
                var body = {
                    startPlanetId: startPlanetId,
                    endPlanetId: endPlanetId,
                    shipCount: getPlanet(startPlanetId).shipCount / 2
                };

                $.post(host + '/moves', body);
            });
        };

        function getPlanet(id) {
            var planets = game().planets;
            var length = planets.length;

            for (var i = 0; i < length; i++) {
                if (planets[i].id == id) {
                    return planets[i];
                }
            }

            return null;
        };

        return {
            game: game,
            sendMoves: sendMoves
        }
    }();
})(pwar);


ko.applyBindings(pwar);