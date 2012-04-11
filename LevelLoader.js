ROBOTGAME.namespace('ROBOTGAME.LevelLoader');

ROBOTGAME.LevelLoader = (function () {

    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2BodyDef = Box2D.Dynamics.b2BodyDef;

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    var bodyDef = new b2BodyDef;

    var CreatePlayer = function (x, y, world) {
        bodyDef.type = b2Body.b2_dynamicBody;
        fixDef.shape = new b2CircleShape(0.5);
        bodyDef.position.Set(x + 0.5, y + 0.5);
        bodyDef.allowSleep = false;
        bodyDef.userData = { type: 'player' };
        player = world.CreateBody(bodyDef).CreateFixture(fixDef);
        world.player = player;

        player.MoveLeft = function () {
            var currentVelocity = this.GetBody().GetLinearVelocity();
            this.GetBody().SetLinearVelocity(new b2Vec2(-2.5, currentVelocity.y));
        };
        player.MoveRight = function () {
            var currentVelocity = this.GetBody().GetLinearVelocity();
            this.GetBody().SetLinearVelocity(new b2Vec2(2.5, currentVelocity.y));
        };
        player.Jump = function () {
            var currentVelocity = this.GetBody().GetLinearVelocity();
            if (currentVelocity.y === 0) {
                this.GetBody().SetLinearVelocity(new b2Vec2(currentVelocity.x, -6.5));
            }
        };
    };

    var CreateBlock = function (x, y, type, world) {
        console.log(type);
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(0.5, 0.5);
        bodyDef.position.Set(x + 0.5, y + 0.5);
        bodyDef.userData = { type: type };
        world.CreateBody(bodyDef).CreateFixture(fixDef);
    };

    return {
        Load: function (levelNumber, world) {
            var levelFileName = "Level" + levelNumber + ".txt";

            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var levelData = JSON.parse(request.responseText);
                    for (i in levelData) {
                        if (levelData[i].type === "player") {
                            CreatePlayer(levelData[i].x, levelData[i].y, world);
                        } else {
                            CreateBlock(levelData[i].x, levelData[i].y, levelData[i].type, world);
                        }
                    }
                }
            }
            request.open("GET", levelFileName, false);
            request.send();
        }
    };
} ());