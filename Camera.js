ROBOTGAME.namespace('ROBOTGAME.Camera');

ROBOTGAME.Camera = (function () {
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    var debugDraw,
        debugDrawOn,
        yoffset;

    var SetupDebugDraw = function (canvasElement, world) {
        debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById(canvasElement).getContext("2d"));
        debugDraw.SetDrawScale(32.0);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
    };

    var DrawWorld = function (gameWorld) {
        var scale = 64;
        var worldbody = gameWorld.GetBodyList();
        var playerpos = gameWorld.player.GetBody().GetPosition();
        var canvas = document.getElementById("levelCanvas")
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(430, 320);
        ctx.translate(-playerpos.x * scale, -playerpos.y * scale);
        while (worldbody.GetNext() !== null) {
            var bodypos = worldbody.GetPosition();
            if (worldbody.GetUserData().type === 'brick') {
                DrawBox(bodypos.x, bodypos.y);
            } else {
                DrawPlayer(bodypos.x, bodypos.y);
            }
            worldbody = worldbody.GetNext();
        }

        ctx.restore();
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

    return {
        Init: function (world) {
            debugDrawOn = false;
            SetupDebugDraw("levelCanvas", world);
            yoffset = 0;
        },
        ToggleDebugDraw: function () {
            debugDrawOn = !debugDrawOn;
        },
        MoveDown: function () {
            yoffset++;
        },
        Draw: function (world) {
            if (debugDrawOn) {
                world.DrawDebugData();
            } else {
                DrawWorld(world);
            }
        }
    };

} ());