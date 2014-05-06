var pwar = {};

var host = window.location.origin || window.location.protocol + '//' + window.location.host;

// socketIO
(function (pw) {
    pw.socketIO = io.connect(host);

    pw.socketIO.on('games', updateGames)
    pw.socketIO.on('game', updateGame);

    function updateGames(games) {
        pw.lobbyViewModel.games(games);
    }

    function updateGame(game) {
        //pw.gameViewModel.game(game);
        //pw.debugViewModel.game(game);
        //drawGame(game);
        //paper.view.draw();
    };
})(pwar);

// debugger
(function (pw) {
    pw.debugViewModel = {
        isVisible: ko.observable(false),
        game: ko.observable()
    };
})(pwar);

(function (pw) {
    pw.lobbyViewModel = function () {
        var isVisible = ko.observable(true);
        var games = ko.observableArray([]);
        var playerName = ko.observable('tst');
        var createGameName = ko.observable('');

        function onCreateGame() {
            $.post(host + '/games', { name: createGameName(), playerName: playerName() }, function (game) {
                isVisible(false);
                pw.gameViewModel.game(game);
                pw.gameViewModel.isVisible(true);
            });
        };

        function onJoinGame(game, event) {
            $.post(host + '/players', { gameId: game.id, name: playerName() }, function (game) {
                isVisible(false);
                pw.gameViewModel.game(game);
                pw.gameViewModel.isVisible(true);
            });
        };

        return {
            isVisible: isVisible,
            games: games,
            playerName: playerName,
            createGameName: createGameName,
            onCreateGame: onCreateGame,
            onJoinGame: onJoinGame
        }
    }();
})(pwar);

// game
(function (pw) {
    pw.gameViewModel = function () {
        var isVisible = ko.observable(false);
        var game = ko.observable(null);
        var isStarted = ko.computed(function () {
            return game() != null && game().isStarted;
        });
        var players = ko.computed(function () {
            return game() != null ? game().players : [];
        });

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
            isVisible: isVisible,
            isStarted: isStarted,
            players : players,
            game: game,
            sendMoves: sendMoves
        }
    }();
})(pwar);


ko.applyBindings(pwar);