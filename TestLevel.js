function TestLevelInit() {
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
    
    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape = new b2PolygonShape;
    for (var i = levelData.length - 1; i >= 0; i--) {
        if (levelData[i] > 0) {
            createBlock(i % 25, Math.floor(i / 25));
        }
    }
    
    //create player
    bodyDef.type = b2Body.b2_dynamicBody;
    fixDef.shape = new b2CircleShape(0.5);
    bodyDef.position.Set(15, 10);
    bodyDef.allowSleep = false;    
    var player = world.CreateBody(bodyDef).CreateFixture(fixDef);
    
    //setup debug draw
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("levelCanvas").getContext("2d"));
    debugDraw.SetDrawScale(32.0);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);

    window.setInterval(update, 1000 / 60);

    //mouse

    var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
    var canvasPosition = getElementPosition(document.getElementById("levelCanvas"));

    document.addEventListener("mousedown", function (e) {
        isMouseDown = true;
        handleMouseMove(e);
        document.addEventListener("mousemove", handleMouseMove, true);
    }, true);

    document.addEventListener("mouseup", function () {
        document.removeEventListener("mousemove", handleMouseMove, true);
        isMouseDown = false;
        mouseX = undefined;
        mouseY = undefined;
    }, true);

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

    function createBlock(x, y) {
        fixDef.shape.SetAsBox(0.5, 0.5);
        bodyDef.position.Set(x + 0.5, y + 0.5);
        world.CreateBody(bodyDef).CreateFixture(fixDef);
    };
       
    function handleMouseMove(e) {
        mouseX = (e.clientX - canvasPosition.x) / 32;
        mouseY = (e.clientY - canvasPosition.y) / 32;
    };

    function getBodyAtMouse() {
        mousePVec = new b2Vec2(mouseX, mouseY);
        var aabb = new b2AABB();
        aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
        aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);

        // Query the world for overlapping shapes.

        selectedBody = null;
        world.QueryAABB(getBodyCB, aabb);
        return selectedBody;
    }

    function getBodyCB(fixture) {
        if (fixture.GetBody().GetType() != b2Body.b2_staticBody) {
            if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
                selectedBody = fixture.GetBody();
                return false;
            }
        }
        return true;
    }

    //update

    function update() {

        if (isMouseDown && (!mouseJoint)) {
            var body = getBodyAtMouse();
            if (body) {
                var md = new b2MouseJointDef();
                md.bodyA = world.GetGroundBody();
                md.bodyB = body;
                md.target.Set(mouseX, mouseY);
                md.collideConnected = true;
                md.maxForce = 300.0 * body.GetMass();
                mouseJoint = world.CreateJoint(md);
                body.SetAwake(true);
            }
        }

        if (mouseJoint) {
            if (isMouseDown) {
                mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
            } else {
                world.DestroyJoint(mouseJoint);
                mouseJoint = null;
            }
        }

        world.Step(1 / 60, 10, 10);
        world.DrawDebugData();
        world.ClearForces();
    };

    //helpers

    //http://js-tut.aardon.de/js-tut/tutorial/position.html
    function getElementPosition(element) {
        var elem = element, tagname = "", x = 0, y = 0;

        while ((typeof (elem) == "object") && (typeof (elem.tagName) != "undefined")) {
            y += elem.offsetTop;
            x += elem.offsetLeft;
            tagname = elem.tagName.toUpperCase();

            if (tagname == "BODY")
                elem = 0;

            if (typeof (elem) == "object") {
                if (typeof (elem.offsetParent) == "object")
                    elem = elem.offsetParent;
            }
        }

        return { x: x, y: y };
    }
};