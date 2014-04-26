var pwar = {};

var host = window.location.origin || window.location.protocol + '//' + window.location.host;

// socketIO
(function (pw) {
    pw.socketIO = io.connect(host);

    pw.socketIO.on('planets', function (planets) {
        pw.debugViewModel.rawdata(JSON.stringify(planets));
    });
})(pwar);

// debugger
(function (pw) {
    pw.debugViewModel = {
        rawdata: ko.observable()
    };
})(pwar);


ko.applyBindings(pwar);