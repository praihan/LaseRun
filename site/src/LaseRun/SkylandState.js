this.LaseRun = this.LaseRun || {};

(function(undefined) {
    "use strict";

    var SkylandState = function() {
        this.objects = {};
        this._cachedValues = {};
    }

    LaseRun.extend(SkylandState, LaseRun.GameState);

    var p = SkylandState.prototype;

    p.preload = function() {
        var assets = LaseRun.path.assets;
        this.load.image("skyland/map/sky", assets.common.child("textures/blueSky.png"));
        this.load.image("skyland/map/tiles", assets.common.child("textures/kennyTiles.png"));
        this.load.image("skyland/chars/redBall", assets.common.child("chars/redBall.png"));

        this.load.tilemap("skyland/map", assets.level.child("skyland/map.json"), null, Phaser.Tilemap.TILED_JSON);
        this.load.text("skyland/map/rules", assets.level.child("skyland/rules.json"));
    }

    p.create = function() {
        this.objects["cursors"] = this.input.keyboard.createCursorKeys();

        var rules = JSON.parse(this.cache.getText("skyland/map/rules"));

        var physicsType = rules["physics"]["type"];

        this.physics.startSystem(Phaser.Physics[physicsType.toUpperCase()]);

        var map = this.map = this.add.tilemap("skyland/map");
        map.addTilesetImage("tiles", "skyland/map/tiles");
        map.addTilesetImage("sky", "skyland/map/sky");

        var sky = this.objects["sky"] = map.createLayer("sky");
        var ground = this.objects["ground"] = map.createLayer("tiles");
        
        map.setCollision(rules["map"]["layers"]["tiles"]["collisions"], true, ground);
        ground.resizeWorld();

        var redBall = this.objects["redBall"] = this.add.sprite(map.tileWidth * 2, map.heightInPixels - map.tileWidth * 5, "skyland/chars/redBall");
        (function() {
            var size = rules["char"]["size"];
            redBall.scale.setTo(size["width"] / redBall.texture.width, size["height"] / redBall.texture.height);
        })();

        this.physics.enable(redBall);

        LaseRun.property.apply(redBall.body, rules["char"]["body"]);
        delete rules["physics"]["type"];
        LaseRun.property.apply(this.physics[physicsType.toLowerCase()], rules["physics"]);
        
        this.camera.x = 0;
        this.camera.y = map.heightInPixels;

        this.camera.follow(redBall);
        var init = rules["map"]["init"];
        this._cachedValues["dv"] = init["deltaVelocity"];
        this._cachedValues["v"] = init["velocity"];
        this.objects["checkpoints"] = rules["map"]["checkpoints"];
    }

    p.update = function() {
        var redBall = this.objects["redBall"];
        this.physics.arcade.collide(redBall, this.objects["ground"]);
        
        var cursors = this.objects["cursors"];

        redBall.body.velocity.x = this._cachedValues["v"];
        if (cursors.up.isDown) {
            redBall.body.velocity.y -= this._cachedValues["dv"];
        }
    }

    p.render = function() {
    }

    LaseRun.SkylandState = SkylandState;

})();