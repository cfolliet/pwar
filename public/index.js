var pwar = {};

var host = window.location.origin || window.location.protocol + '//' + window.location.host;

// socketIO
(function (pw) {
    pw.socketIO = io.connect(host);

    pw.socketIO.on('game', function (game) {
        pw.debugViewModel.rawdata(JSON.stringify(game));
    });
})(pwar);

// debugger
(function (pw) {
    pw.debugViewModel = {
        rawdata: ko.observable()
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