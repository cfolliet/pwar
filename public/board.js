var objects = [];
var game = pwar.gameViewModel;
var currentSelection = [];

drawGame = function (game) {
    game.planets.forEach(function (planet) {
        drawPlanet(planet);
    });
};

function drawPlanet(planet) {
    var group = get(planet.id);

    if (group == null) {
        group = initPlanet(planet);
    }

    var circle = group.children['circle'];
    var text = group.children['shipCount'];

    text.content = planet.shipCount;
};

function initPlanet(planet) {
    var group = new Group();
    group.gameId = planet.id;
    objects.push(group);

    var position = planet.position;
    var point = new Point(position.x, position.y);
    circle = new Path.Circle(point, planet.size / 2);
    circle.strokeColor = 'black';
    circle.fillColor = 'green';
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
    var circle = group.children['circle'];

    if (circle.isSelected) {
        currentSelection = $.grep(currentSelection, function (value) {
            return value != group.gameId
        });

        circle.fillColor = 'green';
        circle.isSelected = false;
    }
    else {
        currentSelection.push(group.gameId);
        circle.fillColor = 'blue';
        circle.isSelected = true;
    }
};

function rightClick(group) {
    game.sendMoves(currentSelection, group.gameId);

    currentSelection.forEach(function (selection) {
        var g = get(selection);
        var c = g.children['circle'];
        c.fillColor = 'green';
        c.isSelected = false;
    });

    currentSelection = [];
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