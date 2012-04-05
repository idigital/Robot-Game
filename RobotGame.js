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

	var CreatePlayer = function () {
		bodyDef.type = b2Body.b2_dynamicBody;
		fixDef.shape = new b2CircleShape(0.5);
		bodyDef.position.Set(10, 10);
		bodyDef.allowSleep = false;
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
				//move right
				player.MoveRight();
			} else if (key.keyCode === 87) {
				player.Jump();
			} else if (key.keyCode === 83) {
				//move down
			}
		});
	};


	// public API
	return {
		Init: function () {
			CreateWorld();
			CreatePlayer();
			SetupControls();
			SetupDebugDraw("levelCanvas");
		},

		LoadLevel: function (levelNumber) {
			var levelFileName = "Level" + levelNumber + ".txt";
			console.log("Loading Level from " + levelFileName);
			var request = new XMLHttpRequest();
			request.onreadystatechange = function () {
				if (request.readyState == 4 && request.status == 200) {
					var levelData = JSON.parse(request.responseText);
					for (i in levelData) {                        
						CreateBlock(levelData[i].x, levelData[i].y);
					}
				}
			}
			request.open("GET", levelFileName, false);
			request.send();
		},

		Update: function() {
			world.Step(1 / 60, 10, 10);
			world.DrawDebugData();
			world.ClearForces();
		},

		Play: function () {
			this.Init();
			this.LoadLevel(1);
			window.setInterval(this.Update, 1000 / 60);
		}
	};
} ());
