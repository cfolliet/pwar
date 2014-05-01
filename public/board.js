var objects = [];

drawGame = function (game) {
    game.planets.forEach(function (planet) {
        drawPlanet(planet);
    });
};

function drawPlanet(planet) {
    var group = get(planet.id);
    var circle;
    var text;

    if (group == null) {
        var group = new Group();
        group.gameId = planet.id;
        objects.push(group);


        var position = planet.position;
        var point = new Point(position.x, position.y);
        circle = new Path.Circle(point, planet.size / 2);
        circle.strokeColor = 'black';
        circle.name = 'circle';

        text = new PointText(point);
        text.justification = 'center';
        text.fillColor = 'black';
        text.name = 'shipCount';

        group.addChild(circle);
        group.addChild(text);
    }
    else {
        circle = group.children['circle'];
        text = group.children['shipCount'];
    }

    text.content = planet.shipCount;
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