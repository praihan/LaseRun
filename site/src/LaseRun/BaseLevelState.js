this.LaseRun = this.LaseRun || {};

(function(undefined) {
    "use strict";

    var BaseLevelState = function(params) {
        BaseLevelState.super[0].call(this);
        this.objects = {};
        this._cachedValues = {};
        this._params = params;
        this._inQuestion = false;
        this._isPaused = false;
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
        this.load.image(params.name + "/ui/questionPanel", params.resources.ui.questionPanel.path);
        this.load.image(params.name + "/ui/acceptButton", params.resources.ui.acceptButton.path);
        this.load.image(params.name + "/ui/denyButton", params.resources.ui.denyButton.path);

        this.load.image(params.name + "/ui/questionPanel", params.resources.ui.questionPanel.path);
        this.load.image(params.name + "/ui/correctAnswer", params.resources.ui.correctAnswer.path);
        this.load.image(params.name + "/ui/wrongAnswer", params.resources.ui.wrongAnswer.path);
        this.load.image(params.name + "/ui/defaultAnswer", params.resources.ui.defaultAnswer.path);
        this.load.image(params.name + "/ui/questionFailPanel", params.resources.ui.questionFailPanel.path);
        this.load.image(params.name + "/ui/gameEndPanel", params.resources.ui.gameEndPanel.path);

        this.load.spritesheet(params.name + "/map/coins", params.resources.coins.path, params.resources.coins.tileWidth, params.resources.coins.tileHeight);
        this.load.spritesheet(params.name + "/map/laser", params.resources.laser.path, params.resources.laser.tileWidth, params.resources.laser.tileHeight);

        this.load.tilemap(params.name + "/map", params.resources.tilemap.path, null, params.resources.tilemap.type);
        this.load.json(params.name + "/map/rules", params.resources.rules.path);

        this.load.audio(params.name + "/audio/coinCollect", [params.resources.coinCollect.path["mp3"], params.resources.coinCollect.path["ogg"]]);
    }

    p.create = function() {
        var params = this._params;

        this._isPaused = true;

        this._isInputDown = false;
        this.input.touch.touchStartCallback = function() {
            _this._isInputDown = true;
        }
        this.input.touch.touchEndCallback = function() {
            _this._isInputDown = false;
        }

        var tween = this.add.tween(this.world).to({alpha: 1}, 400, Phaser.Easing.Quadratic.InOut, false, 0, 0, false);
        tween.onComplete.add(function() {

        }, this);
        tween.start();
        // TODO: countdown sound

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

        // lasers
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

            // score
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
                            this._isPaused = false;
                            ball.body.moves = true;
                        } else {
                            t.anchor.set(0.5);
                            t.setText(count);
                        }

                    }, this);
            }).call(this);

            // sound and music buttons
            (function() {

                var genButton = function(name) {
                    var buttonName = name + "Button";
                    var buttonRules = rules["ui"][buttonName];
                    var position = buttonRules["position"];
                    var size = buttonRules["size"];

                    var enabledName = name + "Enabled";

                    var b = this.objects[buttonName] = this.add.sprite(
                        position["x"], 
                        position["y"], 
                        params.name + "/ui/" + buttonName + "/" + (LaseRun.settings[enabledName] ? "active" : "inactive")
                    );
                    LaseRun.scaler(b, "texture").scale(size);
                    b.inputEnabled = true;

                    var SCALE_FACTOR = 1.2;

                    var scale = {x: b.scale.x, y: b.scale.y};
                    b.events.onInputOver.add(function() {
                        this.add.tween(b.scale).to({x: SCALE_FACTOR * scale.x, y: SCALE_FACTOR * scale.y}, 200, Phaser.Easing.Quintic.InOut, true, 0, 0, false);
                    }, this);

                    b.events.onInputOut.add(function() {
                        this.add.tween(b.scale).to({x: scale.x, y: scale.y}, 200, Phaser.Easing.Quintic.InOut, true, 0, 0, false);
                    }, this);

                    b.events.onInputDown.add(function() {
                        LaseRun.settings[enabledName] ^= true;
                        b.loadTexture((params.name + "/ui/" + buttonName +"/") + (LaseRun.settings[enabledName] ? "active" : "inactive"));
                    }, this);

                    b.fixedToCamera = true;
                }

                genButton.call(this, "music");
                genButton.call(this, "sound");
                
            }).call(this);

            // back button and menu
            (function() {
                var backButton = rules["ui"]["backButton"];
                var position = backButton["position"];
                var size = backButton["size"];

                var b = this.objects["backButton"] = this.add.sprite(position["x"], position["y"], params.name + "/ui/backButton");
                b.anchor.setTo(0.5);
                LaseRun.scaler(b, "texture").scale(size);
                b.fixedToCamera = true;
                b.inputEnabled = true;

                var menuPanelRules = rules["ui"]["menuPanel"];
                var menuSize = menuPanelRules["size"];

                var SCALE_FACTOR = 1.2;

                var scale = {x: b.scale.x, y: b.scale.y};
                b.events.onInputOver.add(function() {
                    this.add.tween(b.scale).to({x: SCALE_FACTOR * scale.x, y: SCALE_FACTOR * scale.y}, 200, Phaser.Easing.Quintic.InOut, true, 0, 0, false);
                }, this);

                b.events.onInputOut.add(function() {
                    this.add.tween(b.scale).to({x: scale.x, y: scale.y}, 200, Phaser.Easing.Quintic.InOut, true, 0, 0, false);
                }, this);

                b.events.onInputDown.add(function() {
                    this._isPaused = true;
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
                                acceptButton.x = center.x - acceptButtonSize.width;
                                acceptButton.y = center.y + acceptButtonSize.height;
                                acceptButton.anchor.set(0.5);
                                acceptButton.fixedToCamera = true;

                                var denyButton = this.add.sprite(0, 0, params.name + "/ui/denyButton");
                                denyButton.anchor.set(0.5);
                                var denyButtonScaler = LaseRun.scaler(denyButton, "texture");
                                var denyButtonSize = rules["ui"]["denyButton"]["size"];
                                denyButtonScaler.scale(denyButtonSize);
                                denyButton.x = center.x + denyButtonSize.width;
                                denyButton.y = center.y + denyButtonSize.height;
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

                                var closeWarning = this.add.text(center.x, center.y - menuSize.height / 10, rules["ui"]["menuPanel"]["closeWarning"]["text"], rules["ui"]["menuPanel"]["closeWarning"]["style"]);
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
                                            var gTween2 = this.add.tween(g).to({alpha: (this._inQuestion ? 1 : 0)}, 200, Phaser.Easing.Linear.None, false, 0, 0, false);
                                            gTween2.onComplete.add(function() {
                                                var backButtonComeback = this.add.tween(b.scale).to(scale, 400, Phaser.Easing.Sinusoidal.InOut, false, 0, 0, false);
                                                backButtonComeback.onComplete.add(function() {
                                                    b.inputEnabled = true;
                                                }, this);
                                                backButtonComeback.start();
                                                if (!this._inQuestion) {
                                                    ball.body.moves = true;
                                                }
                                                this._isPaused = false;
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
        LaseRun.update();
        if (this._inQuestion || this._isPaused) {
            return;
        }
        var rules = this.objects["rules"];
        var map = this.objects["map"];
        var ball = this.objects["ball"];
        var params = this._params;
        this.physics.arcade.collide(ball, this.objects["ground"]);
        if (!this._ended && (ball.x + (ball.scale.x * ball.texture.width) > (rules["map"]["end"] * map.tileWidth))) {
            var center = {
                x: this.stage.bounds.width / 2, 
                y: this.stage.bounds.height / 2
            }
            this._ended = true;
            var backButton = this.objects["backButton"];
            backButton.inputEnabled = true;
            ball.body.moves = false;
            var g = this.objects["blackOverlay"];
            var gTween = this.add.tween(g).to({alpha: 1}, 200, Phaser.Easing.Linear.None, false, 0, 0, false);
            gTween.onComplete.add(function() {
                this.objects["backButton"].inputEnabled = false;
                var gameEndPanelRules = rules["ui"]["gameEndPanel"];
                var s = gameEndPanelRules["size"];
                var t = gameEndPanelRules["text"];
                var st = gameEndPanelRules["style"];

                var gameEndPanel = this.add.sprite(center.x, center.y, params.name + "/ui/gameEndPanel");
                gameEndPanel.visible = false;
                LaseRun.scaler(gameEndPanel, "texture").scale(1, 1);

                var sQ = {
                    x: s["width"] / gameEndPanel.texture.width, 
                    y: s["height"] / gameEndPanel.texture.width
                }

                gameEndPanel.fixedToCamera = true;
                gameEndPanel.anchor.setTo(0.5);
                gameEndPanel.visible = true;
                var gameEndPanelTween = this.add.tween(gameEndPanel.scale).to(sQ, 300, Phaser.Easing.Sinusoidal.InOut, false, 0, 0, false);
                gameEndPanelTween.onComplete.add(function() {
                    var levelCompleteText = this.add.text(
                        center.x, 
                        center.y, 
                        t, 
                        st
                    );
                    levelCompleteText.anchor.set(0.5);
                    levelCompleteText.fixedToCamera = true;

                    var scoreDisplay = this.objects["scoreDisplay"];
                    this.world.bringToTop(scoreDisplay);
                    scoreDisplay.fixedToCamera = false;

                    gameEndPanel.inputEnabled = true;
                    gameEndPanel.events.onInputDown.add(function() {
                        gameEndPanel.inputEnabled = false;
                        var tween = this.add.tween(this.world).to({alpha: 0}, 400, Phaser.Easing.Quadratic.InOut, false, 0, 0, false);
                        tween.onComplete.add(function() {
                            this.state.add("MainMenuState", new LaseRun.MainMenuState());
                            this.state.start("MainMenuState");
                        }, this);
                        tween.start();
                    }, this);
                }, this);
                gameEndPanelTween.start();
            }, this);
            gTween.start();
        }

        this.physics.arcade.overlap(ball, this.objects["lasers"], hitLaser, null, this);

        var coins = this.objects["coins"];
        this.physics.arcade.overlap(ball, coins, collectCoin, null, this);

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

        if (this.input.keyboard.isDown(Phaser.Keyboard.UP) || 
            this.input.keyboard.isDown(Phaser.Keyboard.W) || 
            this.input.mousePointer.isDown || 
            this._isInputDown) {
            // console.log(this.input);
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
        coin.kill();
        if (LaseRun.settings.soundEnabled) {
            this.objects["audio/coinCollect"].play();
        }
        this.objects["score"] += this.objects["rules"]["map"]["coins"]["score"];

        this.objects["scoreDisplay"].setText(this.objects["score"].toString());

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
        if (laser.alreadyHit) {
            return;
        }
        laser.alreadyHit = true;


        var rules = this.objects["rules"];
        var ball = this.objects["ball"];
        var g = this.objects["blackOverlay"];
        var params = this._params;
        ball.body.moves = false;

        this._inQuestion = true;
        var gTween = this.add.tween(g).to({alpha: 1}, 200, Phaser.Easing.Linear.None, false, 0, 0, false);
        gTween.onComplete.add(function() {
            var center = {
                x: this.stage.bounds.width / 2,
                y: this.stage.bounds.height / 2
            }
            var questionPanel = this.add.sprite(center.x, center.y, params.name + "/ui/questionPanel");
            var panelSize = rules["ui"]["questionPanel"]["size"];
            var panelStyle = rules["ui"]["questionPanel"]["style"];
            questionPanel.visible = false;

            var scaleRequired = {
                x: panelSize["width"] / questionPanel.texture.width,
                y: panelSize["height"] / questionPanel.texture.height
            }

            var SCALE_FACTOR = 1.2;

            questionPanel.fixedToCamera = true;
            questionPanel.anchor.setTo(0.5);
            questionPanel.visible = true;
            var questionPanelTween = this.add.tween(questionPanel.scale).to(scaleRequired, 300, Phaser.Easing.Sinusoidal.InOut, false, 0, 0, false);
            questionPanelTween.onComplete.add(function() {
                var buttonGroup = this.add.group();
                var size = rules["ui"]["answerButton"]["size"];
                var style = rules["ui"]["answerButton"]["style"];

                var genButton = function(text, correctAnswer) {
                    var b = this.add.labelSprite(0, 0, params.name + "/ui/defaultAnswer", style);
                    b.setText(text);
                    buttonGroup.add(b);
                    var scaler = LaseRun.scaler(b, "texture");
                    scaler.scale(size);

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

                    var text = this.add.text(
                        center.x, 
                        center.y - size.height,
                        (num1 + " " + op + " " + num2).toString(),
                        panelStyle
                    );
                    text.anchor.set(0.5);
                    text.fixedToCamera = true;

                    buttonGroup.add(text);

                    var inputHandler = function(b) {
                        var scale = {x: b.scale.x, y: b.scale.y};
                        b.inputEnabled = true;
                        b.events.onInputOver.add(function() {
                            this.add.tween(b.scale).to({x: SCALE_FACTOR * scale.x, y: SCALE_FACTOR * scale.y}, 200, Phaser.Easing.Quintic.InOut, true, 0, 0, false);
                        }, this);
                        b.events.onInputOut.add(function() {
                            this.add.tween(b.scale).to({x: scale.x, y: scale.y}, 200, Phaser.Easing.Quintic.InOut, true, 0, 0, false);
                        }, this);
                        b.loadAppropriateTextureForAnswer = function() {
                            this.loadTexture(params.name + (correctAnswer ? "/ui/correctAnswer" : "/ui/wrongAnswer"));
                        }
                        b.events.onInputDown.add(function() {
                            buttonGroup.setAll("inputEnabled", false);
                            buttonGroup.callAll("loadAppropriateTextureForAnswer", null);
                            if (correctAnswer) {
                                buttonGroup.forEach(function(obj) {
                                    if (b !== obj) {
                                        smallenAndKill.call(this, obj, 500);
                                    }
                                }, this);
                                smallenAndKill.call(this, b, 500, function() {
                                    smallenAndKill.call(this, questionPanel, 500, function() {
                                        var gTween2 = this.add.tween(g).to({alpha: 0}, 200, Phaser.Easing.Linear.None, false, 0, 0, false);
                                        gTween2.onComplete.add(function() {
                                            this._inQuestion = false;
                                            ball.body.moves = true;
                                        }, this);
                                        gTween2.start();
                                    });
                                })
                            } else {
                                this.objects["backButton"].inputEnabled = false;
                                var questionFailPanelRules = rules["ui"]["questionFailPanel"];
                                var s = questionFailPanelRules["size"];
                                var t = questionFailPanelRules["text"];
                                var st = questionFailPanelRules["style"];

                                var failPanel = this.add.sprite(center.x, center.y, params.name + "/ui/questionFailPanel");
                                failPanel.visible = false;
                                LaseRun.scaler(failPanel, "texture").scale(1, 1);

                                var sQ = {
                                    x: s["width"] / failPanel.texture.width, 
                                    y: s["height"] / failPanel.texture.width
                                }

                                failPanel.fixedToCamera = true;
                                failPanel.anchor.setTo(0.5);
                                failPanel.visible = true;
                                var failPanelTween = this.add.tween(failPanel.scale).to(sQ, 300, Phaser.Easing.Sinusoidal.InOut, false, 0, 0, false);
                                failPanelTween.onComplete.add(function() {
                                    var gameOverText = this.add.text(
                                        center.x, 
                                        center.y, 
                                        t, 
                                        st
                                    );
                                    gameOverText.anchor.set(0.5);
                                    gameOverText.fixedToCamera = true;
                                    failPanel.inputEnabled = true;
                                    failPanel.events.onInputDown.add(function() {
                                        failPanel.inputEnabled = false;
                                        var tween = this.add.tween(this.world).to({alpha: 0}, 1000, Phaser.Easing.Quadratic.InOut, false, 0, 0, false);
                                        tween.onComplete.add(function() {
                                            this.state.add("MainMenuState", new LaseRun.MainMenuState());
                                            this.state.start("MainMenuState");
                                        }, this);
                                        tween.start();
                                    }, this);
                                }, this);
                                failPanelTween.start();
                            }
                        }, this);
                    }
                    inputHandler.call(this, b);
                    return b
                }

                function shuffleArray(array) {
                    for (var i = array.length - 1; i > 0; i--) {
                        var j = Math.floor(Math.random() * (i + 1));
                        var temp = array[i];
                        array[i] = array[j];
                        array[j] = temp;
                    }
                    return array;
                }

                var operators = {
                    "+": function(a, b) {return a + b},
                    "-": function(a, b) {return a - b},
                    "*": function(a, b) {return a * b},
                    "/": function(a, b) {return a / b},
                    "array": ["+", "-", "*", "/"]
                }

                var num1, num2, op, answer;
                var op = operators.array[this.rnd.integerInRange(0, 3)];
                var temp;

                switch (op) {
                    case "+": 
                        num1 = this.rnd.integerInRange(0, 499);
                        num2 = this.rnd.integerInRange(0, 499);
                        break;
                    case "-":
                        num1 = this.rnd.integerInRange(0, 999);
                        num2 = this.rnd.integerInRange(0, 999);
                        temp = Math.max(num1, num2);
                        num2 = Math.min(num1, num2);
                        num1 = temp;
                        break;
                    case "*":
                        num1 = this.rnd.integerInRange(0, 25);
                        num2 = this.rnd.integerInRange(0, 25);
                        break;
                    case "/":
                        do {
                            num1 = this.rnd.integerInRange(0, 250);
                            num2 = this.rnd.integerInRange(0, 250);
                            temp = Math.max(num1, num2);
                            num2 = Math.min(num1, num2);
                            num1 = temp;
                        } while ((num1 % num2) != 0)
                        break;
                }

                answer = operators[op](num1, num2);
                var wrongAnswers = [
                ];

                for (var i = 0; i < 3; ++i) {
                    outerloop:
                    for (;;) {
                        var rnd = this.rnd.integerInRange(-7, 7);
                        if (rnd == 0) {
                            continue outerloop;
                        }
                        var test = answer + rnd;
                        if (test < 0 && op != "-") {
                            continue outerloop;
                        }
                        for (var j = 0; j < wrongAnswers.length; ++j) {
                            if (wrongAnswers[j] == test) {
                                continue outerloop;
                            }
                        }
                        wrongAnswers.push(test);
                        break;
                    }
                }

                if (LaseRun.settings.debugEnabled) {
                    console.log(answer);
                }

                var buttonArray = [
                    genButton.call(this, answer.toString(), true), 
                    genButton.call(this, wrongAnswers[0].toString(), false), 
                    genButton.call(this, wrongAnswers[1].toString(), false),
                    genButton.call(this, wrongAnswers[2].toString(), false)
                ];
                buttonArray = shuffleArray(buttonArray);

                var b;

                b = buttonArray[0];
                b.x = center.x - 1.2 * size.width;
                b.y = center.y + size.height;
                b.fixedToCamera = true;
                
                b = buttonArray[1];
                b.x = center.x + 0.2 * size.width;
                b.y = center.y + size.height;
                b.fixedToCamera = true;
                
                b = buttonArray[2];
                b.x = center.x - 1.2 * size.width;
                b.y = center.y + 2.5 * size.height;
                b.fixedToCamera = true;
                
                b = buttonArray[3];
                b.x = center.x + 0.2 * size.width;
                b.y = center.y + 2.5 * size.height;
                b.fixedToCamera = true;

            }, this);
            questionPanelTween.start();
        }, this);
        gTween.start();

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