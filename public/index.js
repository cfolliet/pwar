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
        pw.debugViewModel.game(game);
        drawGame(game);
        paper.view.draw()
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

        function createPlayer() {
            console.log('create player'); // TODO call the web api
        };

        return {
            createPlayer: createPlayer
        }
    }
})(pwar);


ko.applyBindings(pwar);