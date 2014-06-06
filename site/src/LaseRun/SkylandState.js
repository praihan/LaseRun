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
        this.load.image("SkylandState/map/sky", assets.common.child("bitmaps/blueSky.png"));
        this.load.image("SkylandState/map/tiles", assets.common.child("spritesheets/kennyTiles.png"));
        this.load.image("SkylandState/chars/redBall", assets.common.child("bitmaps/redBall.png"));
        this.load.spritesheet("SkylandState/map/coins", assets.common.child("spritesheets/coins.png"), 32, 32);

        this.load.tilemap("SkylandState/map", assets.level.child("SkylandState/map.json"), null, Phaser.Tilemap.TILED_JSON);
        this.load.text("SkylandState/map/rules", assets.level.child("SkylandState/rules.json"));

        this.load.audio("SkylandState/audio/coinCollect", [assets.common.child("audio/coinCollect.mp3"), assets.common.child("audio/coinCollect.ogg")]);
    }

    p.create = function() {
        var tween = this.add.tween(this.world).to({alpha: 1}, 400, Phaser.Easing.Quadratic.InOut, false, 0, 0, false);
        tween.onComplete.add(function() {

        }, this);
        tween.start();

        this.objects["cursors"] = this.input.keyboard.createCursorKeys();

        var rules = JSON.parse(this.cache.getText("SkylandState/map/rules"));

        var physicsType = this._cachedValues["physicsType"] = rules["physics"]["type"];

        this.physics.startSystem(LaseRun.mapPhysicsType(physicsType.toUpperCase()));

        var map = this.map = this.add.tilemap("SkylandState/map");
        map.addTilesetImage("tiles", "SkylandState/map/tiles");
        map.addTilesetImage("sky", "SkylandState/map/sky");

        var sky = this.objects["sky"] = map.createLayer("sky");
        var ground = this.objects["ground"] = map.createLayer("tiles");
        
        map.setCollision(rules["map"]["layers"]["tiles"]["collisions"], true, ground);

        ground.resizeWorld();

        var coins = this.objects["coins"] = this.add.group();
        coins.enableBody = true;
        coins.physicsBodyType = LaseRun.mapPhysicsType(physicsType.toUpperCase())

        map.createFromObjects("coins", 158, "SkylandState/map/coins", 0, true, false, coins);
        coins.callAll("animations.add", "animations", "spin", [0, 1, 2, 3, 4, 5], 10, true);
        coins.callAll("animations.play", "animations", "spin");
        coins.setAll("body.allowGravity", false);

        var redBall = this.objects["redBall"] = this.add.sprite(map.tileWidth * 2, map.heightInPixels - map.tileWidth * 5, "SkylandState/chars/redBall");

        LaseRun.scaler(redBall, "texture").scale(rules["char"]["size"]);

        this.physics.enable(redBall);
        LaseRun.property.apply(redBall.body, rules["char"]["body"]);
        delete rules["physics"]["type"];
        LaseRun.property.apply(this.physics[physicsType.toLowerCase()], rules["physics"]);
        
        this.camera.x = 0;
        this.camera.y = map.heightInPixels;

        this.camera.follow(redBall, Phaser.Camera[rules["map"]["camera"]["follow"]]);
        var init = rules["char"]["movement"];
        applyMovement(this._cachedValues, rules["char"]["movement"]);
        var checkpoints = this.objects["checkpoints"] = rules["map"]["checkpoints"] || [];
        this._cachedValues["currentCheckpoint"] = checkpoints[0];
        this._cachedValues["currentCheckpointIndex"] = 0;

        redBall.body.moves = false;

        // init countdown
        (function() {
            var g = this.add.graphics(0, 0);
            g.lineStyle(1, 0, 0.5);
            g.beginFill(0, 0.5);
            g.drawRect(0, 0, this.stage.bounds.width, this.stage.bounds.height);
            g.endFill();

            var style = { font: "200px monospace", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 3};
            var count = 3;
            var t = this.add.text(this.stage.bounds.width / 2, this.stage.bounds.height / 2, count, style);
            t.anchor.set(0.5);
            this.time.events.repeat(Phaser.Timer.SECOND, count, 
                function() {
                    count--;
                    if (count == 0) {
                        t.destroy();
                        g.destroy();
                        redBall.body.moves = true;
                    } else {
                        t.anchor.set(0.5);
                        t.setText(count);
                    }

                }, this);
        }).call(this);

        this.objects["audio/coinCollect"] = this.add.audio("SkylandState/audio/coinCollect");
    }

    p.update = function() {
        var redBall = this.objects["redBall"];
        this.physics[this._cachedValues["physicsType"]].collide(redBall, this.objects["ground"]);

        var coins = this.objects["coins"];
        this.physics[this._cachedValues["physicsType"]].overlap(redBall, coins, collectCoin, null, this);
        
        var cursors = this.objects["cursors"];

        var currentCheckpointIndex = this._cachedValues["currentCheckpointIndex"];

        var currentCheckpoint = this._cachedValues["currentCheckpoint"];;
        if (currentCheckpoint) {
            if (redBall.body.x >= currentCheckpoint["distance"] * this.map.tileWidth) {
                applyMovement(this._cachedValues, currentCheckpoint);
                var bodyRules = currentCheckpoint["body"];
                if (bodyRules) {
                    LaseRun.property.apply(redBall.body, bodyRules);
                }
                this._cachedValues["currentCheckpoint"] = this.objects["checkpoints"][++this._cachedValues["currentCheckpointIndex"]];
            }
        }

        if (cursors.up.isDown) {
            redBall.body.velocity.y -= this._cachedValues["acceleration"];
        }

        redBall.body.velocity.x = this._cachedValues[cursors.left.isDown ? "backpedal" : "velocity"];
    }

    p.render = function() {
    }

    var applyMovement = function(obj, json) {
        var dvdt = json["acceleration"];
        var v = json["velocity"];
        var bp = json["backpedal"];

        if (typeof dvdt !== "undefined") {
            obj["acceleration"] = dvdt;
        }
        if (typeof v !== "undefined") {
            obj["velocity"] = v;
        }
        if (typeof bp !== "undefined") {
            obj["backpedal"] = bp;
        }
    }

    var collectCoin = function(ball, coin) {
        coin.kill();
        this.objects["audio/coinCollect"].play();
    }

    LaseRun.SkylandState = SkylandState;

})();