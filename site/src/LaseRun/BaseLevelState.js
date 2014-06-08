this.LaseRun = this.LaseRun || {};

(function(undefined) {
    "use strict";

    var BaseLevelState = function(params) {
        BaseLevelState.super[0].call(this);
        this.objects = {};
        this._cachedValues = {};
        this._params = params;
    }

    LaseRun.extend(BaseLevelState, LaseRun.GameState);

    var p = BaseLevelState.prototype;

    p.preload = function() {
        var assets = LaseRun.path.assets;
        var params = this._params;
        this.load.image(params.name + "/map/sky", params.resources.sky.path);
        this.load.image(params.name + "/map/tiles", params.resources.tiles.path);
        this.load.image(params.name + "/map/laserButt", params.resources.laserButt.path);
        this.load.image(params.name + "/chars/ball", params.resources.ball.path);

        this.load.image(params.name + "/ui/backButton", params.resources.ui.backButton.path);
        this.load.image(params.name + "/ui/soundButton/active", params.resources.ui.soundButton.path.active);
        this.load.image(params.name + "/ui/soundButton/inactive", params.resources.ui.soundButton.path.inactive);
        this.load.image(params.name + "/ui/musicButton/active", params.resources.ui.musicButton.path.active);
        this.load.image(params.name + "/ui/musicButton/inactive", params.resources.ui.musicButton.path.inactive);
        this.load.image(params.name + "/ui/menuPanel", params.resources.ui.menuPanel.path);
        this.load.image(params.name + "/ui/acceptButton", params.resources.ui.acceptButton.path);
        this.load.image(params.name + "/ui/denyButton", params.resources.ui.denyButton.path);

        this.load.spritesheet(params.name + "/map/coins", params.resources.coins.path, params.resources.coins.tileWidth, params.resources.coins.tileHeight);
        this.load.spritesheet(params.name + "/map/laser", params.resources.laser.path, params.resources.laser.tileWidth, params.resources.laser.tileHeight);

        this.load.tilemap(params.name + "/map", params.resources.tilemap.path, null, params.resources.tilemap.type);
        this.load.json(params.name + "/map/rules", params.resources.rules.path);

        this.load.audio(params.name + "/audio/coinCollect", [params.resources.coinCollect.path["mp3"], params.resources.coinCollect.path["ogg"]]);
    }

    p.create = function() {
        var params = this._params;

        var tween = this.add.tween(this.world).to({alpha: 1}, 400, Phaser.Easing.Quadratic.InOut, false, 0, 0, false);
        tween.onComplete.add(function() {

        }, this);
        tween.start();
        // TODO: countdown sound

        this.objects["cursors"] = this.input.keyboard.createCursorKeys();

        var rules = this.objects["rules"] = this.cache.getJSON(params.name + "/map/rules");

        this.objects["score"] = rules["map"]["coins"]["initScore"];

        this.physics.startSystem(Phaser.Physics.ARCADE);

        var map = this.objects["map"] = this.add.tilemap(params.name + "/map");
        map.addTilesetImage("tiles", params.name + "/map/tiles");
        map.addTilesetImage("sky", params.name + "/map/sky");

        var sky = this.objects["sky"] = map.createLayer("sky");
        var ground = this.objects["ground"] = map.createLayer("tiles");
        map.createLayer("signs");
        
        map.setCollision(rules["map"]["tiles"]["collisions"], true, ground);

        ground.resizeWorld();

        var coins = this.objects["coins"] = this.add.group();
        coins.enableBody = true;
        coins.physicsBodyType = Phaser.Physics.ARCADE;

        map.createFromObjects("coins", rules["map"]["tiles"]["coins"], params.name + "/map/coins", 0, true, false, coins);
        coins.callAll("animations.add", "animations", "spin");
        coins.callAll("animations.play", "animations", "spin", params.resources.coins.frameRate, true);
        coins.setAll("body.allowGravity", false);

        var ball = this.objects["ball"] = this.add.sprite(
            map.tileWidth * rules["char"]["position"]["x"], 
            map.tileWidth * rules["char"]["position"]["y"], 
            params.name + "/chars/ball");

        LaseRun.scaler(ball, "texture").scale(rules["char"]["size"]);

        this.physics.enable(ball);

        LaseRun.property.apply(ball.body, rules["char"]["body"]);
        LaseRun.property.apply(this.physics.arcade, rules["physics"]);
        
        this.camera.x = 0;
        this.camera.y = map.heightInPixels;

        this.camera.follow(ball, Phaser.Camera[rules["map"]["camera"]["follow"]]);
        var init = rules["char"]["movement"];
        applyMovement(this._cachedValues, rules["char"]["movement"]);
        var checkpoints = this.objects["checkpoints"] = rules["map"]["checkpoints"] || [];
        this._cachedValues["currentCheckpoint"] = checkpoints[0];
        this._cachedValues["currentCheckpointIndex"] = 0;

        (function() {
            var lasers = this.objects["lasers"] = this.add.group();
            var laserButts = this.objects["laserButts"] = [];
            var layers = map.objects;
            for (var layer in layers) {
                if (layer.indexOf("laser") == 0) {
                    if (layers[layer].length == 3) {
                        var laserGroup = this.add.group();
                        map.createFromObjects(layer, rules["map"]["tiles"]["laserPoles"], params.name + "/map/laserButt", 0, true, false, laserGroup);
                        laserButts.push(laserGroup);
                        var objectLayer = layers[layer];
                        for (var i = 0; i < objectLayer.length; ++i) {
                            var object = objectLayer[i];
                            if (object.name.toLowerCase() == "laser") {
                                var laser = this.add.sprite(object["x"], object["y"], params.name + "/map/laser");
                                laser.name = "laser";
                                this.physics.enable(laser);
                                laser.body.moves = false;
                                LaseRun.scaler(laser, "texture").scale(object["width"], object["height"]);
                                laser.animations.add("shoot");
                                laser.animations.play("shoot", params.resources.laser.frameRate, true);
                                lasers.add(laser);
                            }
                        }
                    }
                }
            }
        }).call(this);

        // hud
        (function() {

            (function() {
                var scoreDisplay = rules["ui"]["scoreDisplay"];
                var position = scoreDisplay["position"];
                var style = scoreDisplay["style"];

                var t = this.objects["scoreDisplay"] = this.add.text(position["x"], position["y"], this.objects["score"].toString(), style);
                t.fixedToCamera = true;
            }).call(this);

            // init countdown
            (function() {
                ball.body.moves = false;
                var g = this.objects["blackOverlay"] = this.add.graphics(0, 0);
                g.fixedToCamera = true;
                g.lineStyle(1, 0, 0.5);
                g.beginFill(0, 0.5);
                g.drawRect(0, 0, this.stage.bounds.width, this.stage.bounds.height);
                g.endFill();

                var style = rules["ui"]["countDown"]["style"];
                var count = 3;
                var t = this.add.text(this.stage.bounds.width / 2, this.stage.bounds.height / 2, count, style);
                t.anchor.set(0.5);
                this.time.events.repeat(Phaser.Timer.SECOND, count, 
                    function() {
                        count--;
                        if (count == 0) {
                            t.destroy();
                            var tween = this.add.tween(g).to({alpha: 0}, 200, Phaser.Easing.Linear.None, false, 0, 0, false);
                            tween.onComplete.add(function() {
                                var b = this.objects["backButton"];
                                b.inputEnabled = true;
                            }, this);
                            tween.start();
                            ball.body.moves = true;
                        } else {
                            t.anchor.set(0.5);
                            t.setText(count);
                        }

                    }, this);
            }).call(this);

            (function() {
                var backButton = rules["ui"]["backButton"];
                var position = backButton["position"];
                var size = backButton["size"];

                var b = this.objects["backButton"] = this.add.sprite(position["x"], position["y"], params.name + "/ui/backButton");
                LaseRun.scaler(b, "texture").scale(size);
                b.fixedToCamera = true;
                b.inputEnabled = true;

                var menuPanelRules = rules["ui"]["menuPanel"];
                var menuSize = menuPanelRules["size"];


                // var menuGroup = this.objects["menuGroup"] = this.add.group();
                // var mP = this.objects["menuPanel"] = this.add.sprite(this.stage.bounds.width / 2, this.stage.bounds.height / 2, params.name + "/ui/menuPanel");
                // mP.fixedToCamera = true;
                // mP.anchor.setTo(0.5);
                // var menuScaler = LaseRun.scaler(mP, "texture");
                // var menuScale = {
                //    x: mP.scale.x,
                //    y: mP.scale.y
                // }
                // menuGroup.add(mP);

                // var acceptButton;

                // (function() {
                    // var buttonSize = rules["ui"]["acceptButton"]["size"];
                    // acceptButton = this.objects["menuPane/acceptButton"] = new Phaser.Sprite(this.game, (menuSize["width"] / 2 - (buttonSize["width"])), (menuSize["height"] / 2 - buttonSize["height"] / 2));
                    // LaseRun.scaler(acceptButton, "texture").scale(buttonSize);
                    // menuGroup.add(acceptButton);
                // }).call(this);  

                // menuScaler.scale(1, 1);
                // mP.visible = false;

                var SCALE_FACTOR = 1.2;

                var scale = {x: b.scale.x, y: b.scale.y};
                b.events.onInputOver.add(function() {
                    this.add.tween(b.scale).to({x: SCALE_FACTOR * scale.x, y: SCALE_FACTOR * scale.y}, 200, Phaser.Easing.Quintic.InOut, true, 0, 0, false);
                }, this);

                b.events.onInputOut.add(function() {
                    this.add.tween(b.scale).to({x: scale.x, y: scale.y}, 200, Phaser.Easing.Quintic.InOut, true, 0, 0, false);
                }, this);

                b.events.onInputDown.add(function() {
                    b.inputEnabled = false;
                    ball.body.moves = false;
                    var tween = this.add.tween(b.scale).to({x: 0, y: 0}, 400, Phaser.Easing.Sinusoidal.InOut, false, 0, 0, false);
                    tween.onComplete.add(function() {
                        var g = this.objects["blackOverlay"];
                        var gTween = this.add.tween(g).to({alpha: 1}, 200, Phaser.Easing.Linear.None, false, 0, 0, false);
                        gTween.onComplete.add(function() {
                            var menuPanel = this.add.sprite(this.stage.bounds.width / 2, this.stage.bounds.height / 2, params.name + "/ui/menuPanel");
                            menuPanel.visible = false;

                            var scaleRequired = {
                                x: menuSize["width"] / menuPanel.texture.width,
                                y: menuSize["height"] / menuPanel.texture.height
                            }

                            menuPanel.fixedToCamera = true;
                            menuPanel.anchor.setTo(0.5);
                            var menuScaler = LaseRun.scaler(menuPanel, "texture");
                            var menuScale = {
                                x: menuPanel.scale.x,
                                y: menuPanel.scale.y
                            }
                            menuPanel.visible = true;
                            var menuTween = this.add.tween(menuPanel.scale).to(scaleRequired, 300, Phaser.Easing.Sinusoidal.InOut, false, 0, 0, false);
                            menuTween.onComplete.add(function() {
                                var acceptButton = this.add.sprite(0, 0, params.name + "/ui/acceptButton");
                                var acceptButtonScaler = LaseRun.scaler(acceptButton, "texture");
                                var acceptButtonSize = rules["ui"]["acceptButton"]["size"];
                                acceptButtonScaler.scale(acceptButtonSize);
                                var center = {
                                    x: this.stage.bounds.width / 2,
                                    y: this.stage.bounds.height / 2
                                }
                                acceptButton.x = center.x - 1.5 * acceptButtonSize.width;
                                acceptButton.y = center.y + acceptButtonSize.height / 2;
                                acceptButton.fixedToCamera = true;

                                var denyButton = this.add.sprite(0, 0, params.name + "/ui/denyButton");
                                
                                var denyButtonScaler = LaseRun.scaler(denyButton, "texture");
                                var denyButtonSize = rules["ui"]["denyButton"]["size"];
                                denyButtonScaler.scale(denyButtonSize);
                                denyButton.x = center.x + denyButtonSize.width / 2;
                                denyButton.y = center.y + denyButtonSize.height / 2;
                                denyButton.fixedToCamera = true;

                                var mouseOverResize = function(b) {
                                    var scale = {x: b.scale.x, y: b.scale.y};
                                    b.inputEnabled = true;
                                    b.events.onInputOver.add(function() {
                                        this.add.tween(b.scale).to({x: SCALE_FACTOR * scale.x, y: SCALE_FACTOR * scale.y}, 200, Phaser.Easing.Quintic.InOut, true, 0, 0, false);
                                    }, this);

                                    b.events.onInputOut.add(function() {
                                        this.add.tween(b.scale).to({x: scale.x, y: scale.y}, 200, Phaser.Easing.Quintic.InOut, true, 0, 0, false);
                                    }, this);
                                }
                                mouseOverResize.call(this, acceptButton);
                                mouseOverResize.call(this, denyButton);

                                var closeWarning = this.add.text(center.x, center.y - menuSize.width / 10, rules["ui"]["closeWarning"]["text"], rules["ui"]["closeWarning"]["style"]);
                                closeWarning.anchor.setTo(0.5);
                                closeWarning.fixedToCamera = true;

                                var smallenAndKill = function(b, time, alsoAdd) {
                                    var t = this.add.tween(b.scale).to({x: 0, y: 0}, time, Phaser.Easing.Quintic.InOut, false, 0, 0, false);
                                    b.inputEnabled = false;
                                    t.onComplete.add(function() {
                                        b.kill ? b.kill() : b.destroy();
                                    }, this);
                                    if (alsoAdd) {
                                        t.onComplete.add(alsoAdd, this);
                                    }
                                    t.start();
                                }

                                acceptButton.events.onInputDown.addOnce(function() {
                                    smallenAndKill.call(this, denyButton, 500);
                                    smallenAndKill.call(this, acceptButton, 500);
                                    smallenAndKill.call(this, closeWarning, 500, function() {
                                        smallenAndKill.call(this, menuPanel, 500, function() {
                                            var gTween2 = this.add.tween(g).to({alpha: 0}, 200, Phaser.Easing.Linear.None, false, 0, 0, false);
                                            gTween2.onComplete.add(function() {
                                                var backButtonComeback = this.add.tween(b.scale).to(scale, 400, Phaser.Easing.Sinusoidal.InOut, false, 0, 0, false);
                                                backButtonComeback.onComplete.add(function() {
                                                    b.inputEnabled = true;
                                                }, this);
                                                backButtonComeback.start();
                                                ball.body.moves = true;
                                            }, this)
                                            gTween2.start();
                                        });
                                    });
                                }, this);

                                denyButton.events.onInputDown.addOnce(function() {
                                    smallenAndKill.call(this, denyButton, 500);
                                    smallenAndKill.call(this, acceptButton, 500);
                                    smallenAndKill.call(this, closeWarning, 500, function() {
                                        smallenAndKill.call(this, menuPanel, 500, function() {
                                            var tween = this.add.tween(this.world).to({alpha: 0}, 400, Phaser.Easing.Quadratic.InOut, false, 0, 0, false);
                                            tween.onComplete.add(function() {
                                                this.state.add("MainMenuState", new LaseRun.MainMenuState());
                                                this.state.start("MainMenuState");
                                            }, this);
                                            tween.start();
                                        });
                                    });
                                }, this);

                            }, this);
                            menuTween.start();

                        }, this);
                        gTween.start();
                    }, this);
                    tween.start();
                    
                }, this);

                b.inputEnabled = false;

            }).call(this);
        }).call(this);

        this.objects["audio/coinCollect"] = this.add.audio(params.name + "/audio/coinCollect");
    }

    p.update = function() {
        var ball = this.objects["ball"];
        this.physics.arcade.collide(ball, this.objects["ground"]);

        this.physics.arcade.overlap(ball, this.objects["lasers"], hitLaser, null, this);

        var coins = this.objects["coins"];
        this.physics.arcade.overlap(ball, coins, collectCoin, null, this);
        
        var cursors = this.objects["cursors"];

        var currentCheckpointIndex = this._cachedValues["currentCheckpointIndex"];

        var currentCheckpoint = this._cachedValues["currentCheckpoint"];;
        if (currentCheckpoint) {
            if (ball.body.x >= currentCheckpoint["distance"] * this.map.tileWidth) {
                applyMovement(this._cachedValues, currentCheckpoint);
                var bodyRules = currentCheckpoint["body"];
                if (bodyRules) {
                    LaseRun.property.apply(ball.body, bodyRules);
                }
                this._cachedValues["currentCheckpoint"] = this.objects["checkpoints"][++this._cachedValues["currentCheckpointIndex"]];
            }
        }

        if (cursors.up.isDown) {
            ball.body.velocity.y -= this._cachedValues["acceleration"];
        }

        ball.body.velocity.x = this._cachedValues["velocity"];
    }

    p.render = function() {
    }

    var applyMovement = function(obj, json) {
        var dvdt = json["acceleration"];
        var v = json["velocity"];

        if (typeof dvdt !== "undefined") {
            obj["acceleration"] = dvdt;
        }
        if (typeof v !== "undefined") {
            obj["velocity"] = v;
        }
    }

    var collectCoin = function(ball, coin) {
        var params = this._params;
        if (!params.callbacks) {
            return;
        }
        var callback = params.callbacks.collectCoin;
        if (callback) {
            var context = callback.context || callback;
            callback.callback.call(context, ball, coin);
        }
    }

    var hitLaser = function(ball, laser) {
        var params = this._params;
        if (!params.callbacks) {
            return;
        }
        var callback = params.callbacks.hitLaser;
        if (callback) {
            var context = callback.context || callback;
            callback.callback.call(context, ball, laser);
        }
    }

    LaseRun.BaseLevelState = BaseLevelState;

})();