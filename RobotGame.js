var ROBOTGAME = (function () {

    // dependencies
    var b2Vec2 = Box2D.Common.Math.b2Vec2,
		b2AABB = Box2D.Collision.b2AABB,
		b2BodyDef = Box2D.Dynamics.b2BodyDef,
		b2Body = Box2D.Dynamics.b2Body,
		b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
		b2Fixture = Box2D.Dynamics.b2Fixture,
		b2World = Box2D.Dynamics.b2World,
		b2MassData = Box2D.Collision.Shapes.b2MassData,
		b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
		b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
		b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
		b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;

    // private variables
    var world;
    var player;
    var debugDrawOn;

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    var bodyDef = new b2BodyDef;

    var debugDraw;

    // private functions
    var CreateWorld = function () {
        world = new b2World(
			new b2Vec2(0, 10),   //gravity
			true                 //allow sleep
		);
    };

    var CreatePlayer = function (x, y) {
        bodyDef.type = b2Body.b2_dynamicBody;
        fixDef.shape = new b2CircleShape(0.5);
        bodyDef.position.Set(x + 0.5, y + 0.5);
        bodyDef.allowSleep = false;
        bodyDef.userData = { type: 'player' };
        player = world.CreateBody(bodyDef).CreateFixture(fixDef);

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

    var CreateBlock = function (x, y) {
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(0.5, 0.5);
        bodyDef.position.Set(x + 0.5, y + 0.5);
        bodyDef.userData = { type: 'brick' };
        world.CreateBody(bodyDef).CreateFixture(fixDef);
    };

    var SetupDebugDraw = function (canvasElement) {
        debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById(canvasElement).getContext("2d"));
        debugDraw.SetDrawScale(32.0);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
    };

    var SetupControls = function () {
        document.addEventListener("keydown", function (key) {
            if (key.keyCode === 65) {
                player.MoveLeft();
            } else if (key.keyCode === 68) {
                player.MoveRight();
            } else if (key.keyCode === 87) {
                player.Jump();
            } else if (key.keyCode === 83) {

            }
        });
    };

    var DrawWorld = function (gameWorld) {
        var scale = 64;
        var worldbody = gameWorld.GetBodyList();
        var canvas = document.getElementById("levelCanvas")
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        while (worldbody.GetNext() !== null) {
            var bodypos = worldbody.GetPosition();
            if (worldbody.GetUserData().type === 'brick') {
                DrawBox(bodypos.x, bodypos.y);
            } else {
                DrawPlayer(bodypos.x, bodypos.y);
            }
            worldbody = worldbody.GetNext();
        }
        function DrawBox(x, y) {
            var img = new Image();
            img.src = "Spritesheet.png";
            ctx.drawImage(img, 0, 32, 32, 32, x * scale, y * scale, scale, scale);
        }
        function DrawPlayer(x, y) {
            var img = new Image();
            img.src = "Spritesheet.png";
            ctx.drawImage(img, 32, 0, 32, 32, x * scale, y * scale, scale, scale);
        }
    };

    // public API
    return {
        Init: function () {
            CreateWorld();
            SetupControls();
            if (debugDrawOn) {
                SetupDebugDraw("levelCanvas");
            }
        },

        LoadLevel: function (levelNumber) {
            var levelFileName = "Level" + levelNumber + ".txt";

            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var levelData = JSON.parse(request.responseText);
                    for (i in levelData) {
                        if (levelData[i].type === "player") {
                            CreatePlayer(levelData[i].x, levelData[i].y);
                        } else {
                            CreateBlock(levelData[i].x, levelData[i].y);
                        }
                    }
                }
            }
            request.open("GET", levelFileName, false);
            request.send();
        },

        Update: function () {
            world.Step(1 / 60, 10, 10);
            if (debugDrawOn) {
                world.DrawDebugData();
            } else {
                DrawWorld(world);
            }
            world.ClearForces();
        },

        Play: function (isDebugDrawOn) {
            debugDrawOn = isDebugDrawOn;
            this.Init();
            this.LoadLevel(1);
            window.setInterval(this.Update, 1000 / 60);
        }
    };
} ());