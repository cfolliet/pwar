var objects = [];
var game = pwar.gameViewModel;
var currentSelection = [];
var playerColors = [];

var selector = null;

function onMouseDrag(event) {
    if (selector != null) {
        selector.remove();
    }

    selector = new Path.Rectangle(event.downPoint, event.point);
    selector.strokeColor = 'yellow';
}

function onMouseUp(event) {
    if (selector != null) {
        game.game().planets.forEach(function (planet) {
            if (selector.contains(new Point(planet.position.x, planet.position.y))) {
                leftClick(get(planet.id));
            }
        });

        selector.remove();
        selector = null;
    }
}

drawGame = function (game) {

    game.players.forEach(function (player) {
        playerColors[player.id] = player.color;
    });

    game.planets.forEach(function (planet) {
        drawPlanet(planet);
    });

    var currentMoves = project.getItems({ name: 'move' });

    game.moves.forEach(function (move) {
        var match = null;

        var length = currentMoves.length;
        for (var i = 0; i < length; i++) {
            if (currentMoves[i].gameId == move.id) {
                match = currentMoves[i];
                currentMoves.splice(i, 1);
                break;
            }
        }

        if (match == null) {
            drawMove(move);
        }
        else {
        }
    });

    var length = currentMoves.length;
    for (var i = 0; i < length; i++) {
        currentMoves[i].remove();
    }
};

function drawPlanet(planet) {
    var group = get(planet.id);

    if (group == null) {
        group = initPlanet(planet);
    }

    var circle = group.children['circle'];
    var text = group.children['shipCount'];

    text.content = planet.shipCount;

    group.isPlayer = planet.ownerPlayerId == game.currentPlayerId();

    if (planet.ownerPlayerId != null) {
        circle.fillColor = playerColors[planet.ownerPlayerId];
    }
    else {
        circle.fillColor = 'grey';
    }
};

function initPlanet(planet) {
    var group = new Group();
    group.gameId = planet.id;
    objects.push(group);

    var position = planet.position;
    var point = new Point(position.x, position.y);
    circle = new Path.Circle(point, planet.size / 2);
    circle.strokeWidth = 5;
    circle.strokeColor = 'black';
    circle.fillColor = 'grey';
    circle.name = 'circle';

    text = new PointText(point);
    text.justification = 'center';
    text.fillColor = 'red';
    text.name = 'shipCount';

    group.addChild(circle);
    group.addChild(text);

    group.onClick = function (mouseEvent) {
        if (mouseEvent.event.button == 0) {
            leftClick(this);
        }
        else if (mouseEvent.event.button == 2) {
            rightClick(this);
        }
    };

    return group;
};

function leftClick(group) {

    if (!group.isPlayer) {
        return;
    }

    var circle = group.children['circle'];

    if (circle.isSelected) {
        currentSelection = $.grep(currentSelection, function (value) {
            return value != group.gameId
        });

        circle.strokeColor = 'black';
        circle.isSelected = false;
    }
    else {
        currentSelection.push(group.gameId);
        circle.strokeColor = 'yellow';
        circle.isSelected = true;
    }
};

function rightClick(group) {
    game.sendMoves(currentSelection, group.gameId);
};

function drawMove(move) {
    var group = get(move.id);

    if (group == null) {
        group = initMove(move);
    }
};

function initMove(move) {
    var group = new Group();
    group.name = 'move';
    group.gameId = move.id;
    objects.push(group);

    var startPoint = get(move.startPlanetId).position;
    var endPoint = get(move.endPlanetId).position;

    circle = new Path.Circle(startPoint, 5);
    circle.strokeColor = 'black';
    circle.fillColor = 'yellow';
    circle.name = 'circle';

    text = new PointText(startPoint);
    text.justification = 'center';
    text.fillColor = 'red';
    text.name = 'shipCount';
    text.content = move.shipCount;

    group.addChild(circle);
    group.addChild(text);

    var vector = endPoint - startPoint;

    group.onFrame = function (event) {
        vector.length = (event.delta * 1000) / 50;
        this.position += vector;
    };

    return group;
};

function get(id) {
    var length = objects.length;

    for (var i = 0; i < length; i++) {
        if (objects[i].gameId == id) {
            return objects[i];
        }
    }

    return null;
};