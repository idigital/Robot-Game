ROBOTGAME.APP = (function () {

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
		b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
        camera = ROBOTGAME.Camera,
        levelLoader = ROBOTGAME.LevelLoader;

    // private variables
    var world;
    var player;


    // private functions
    var CreateWorld = function () {
        world = new b2World(
			new b2Vec2(0, 10),   //gravity
			true                 //allow sleep
		);
    };

    var SetupControls = function () {
        document.addEventListener("keydown", function (key) {
            if (key.keyCode === 65) {           //A
                world.player.moveDir = 'left';
            } else if (key.keyCode === 68) {    //D
                world.player.moveDir = 'right';
            } else if (key.keyCode === 87) {    //W
                world.player.Jump();
            } else if (key.keyCode === 13) {    //'ENTER'
                camera.ToggleDebugDraw();
            }
        });

        document.addEventListener("keyup", function (key) {
            if (key.keyCode === 65 || key.keyCode === 68) {
                world.player.moveDir = 'none';
            }
        });
    };

    // var SetupListeners = function () {
    //     var collisionListener = new Box2D.Dynamics.b2ContactListener;
    //     collisionListener.BeginContact = function (contact) {
    //         console.log("collision detected");
    //         console.dir(contact);            
    //     };
    //     world.SetContactListener(collisionListener);
    // };

    // public API
    return {
        Init: function () {
            CreateWorld();
            camera.Init(world)
        },

        LoadLevel: function (levelNumber) {
            levelLoader.Load(levelNumber, world);
        },

        Update: function () {
            world.Step(1 / 60, 10, 10);
            world.player.Update();
            camera.Draw(world);
            world.ClearForces();
        },

        Play: function () {
            debugDrawOn = false;
            this.Init();
            this.LoadLevel(1);
            SetupControls();
            SetupListeners();
            window.setInterval(this.Update, 1000 / 60);
        }
    };
} ());