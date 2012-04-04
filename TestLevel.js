function Init() {
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

    var world = new b2World(
        new b2Vec2(0, 10),   //gravity
        true                 //allow sleep
    );

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;

    var bodyDef = new b2BodyDef;

    //create player
    bodyDef.type = b2Body.b2_dynamicBody;
    fixDef.shape = new b2CircleShape(0.5);
    bodyDef.position.Set(10, 10);
    bodyDef.allowSleep = false;
    var player = world.CreateBody(bodyDef).CreateFixture(fixDef);

    //load level
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState==4 && request.status==200) {
			console.dir(request);
			var levelData = JSON.parse(request.responseText);
			for (i in levelData) {
				createBlock(levelData[i].x, levelData[i].y);
			}
		}
	}
	request.open("GET", "Level1.txt", true);
	request.send();	
	
	document.addEventListener("keydown", function (key) {
        var currentVelocity = player.GetBody().GetLinearVelocity();
        if (key.keyCode === 65) {
            //move left
            player.GetBody().SetLinearVelocity(new b2Vec2(-2.5, currentVelocity.y));
        } else if (key.keyCode === 68) {
            //move right
            player.GetBody().SetLinearVelocity(new b2Vec2(2.5, currentVelocity.y));
        } else if (key.keyCode === 87) {
            //move up
            if (currentVelocity.y === 0) {
                player.GetBody().SetLinearVelocity(new b2Vec2(currentVelocity.x, -6.5));
            }
        } else if (key.keyCode === 83) {
            //move down                        
        }
    });	
	
    //setup debug draw
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("levelCanvas").getContext("2d"));
    debugDraw.SetDrawScale(32.0);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);

    window.setInterval(update, 1000 / 60);

    function update() {
        world.Step(1 / 60, 10, 10);
        world.DrawDebugData();
        world.ClearForces();
    };

    function createBlock(x, y) {
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(0.5, 0.5);
        bodyDef.position.Set(x + 0.5, y + 0.5);
        world.CreateBody(bodyDef).CreateFixture(fixDef);
    };
}