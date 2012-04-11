ROBOTGAME.namespace('ROBOTGAME.Camera');

ROBOTGAME.Camera = (function () {
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    var debugDraw,
        debugDrawOn;

    var textureMap = {
        brick: { x: 0, y: 1 },
        player: { x: 1, y: 0 },
        warpEnter: { x: 0, y: 0 },
        warpExit: { x: 0, y: 0 }
    };

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
            DrawObject(bodypos.x, bodypos.y, worldbody.GetUserData().type);
            worldbody = worldbody.GetNext();
        }

        ctx.restore();
        function DrawObject(x, y, type) {
            var spriteGridSpacing = 32;
            var img = new Image();
            img.src = "Spritesheet.png";
            var gridx = textureMap[type].x;
            var gridy = textureMap[type].y;
            ctx.drawImage(img, gridx * spriteGridSpacing, gridy * spriteGridSpacing, spriteGridSpacing, spriteGridSpacing, x * scale, y * scale, scale, scale);
        }        
    };

    return {
        Init: function (world) {
            debugDrawOn = false;
            SetupDebugDraw("levelCanvas", world);
        },
        ToggleDebugDraw: function () {
            debugDrawOn = !debugDrawOn;
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