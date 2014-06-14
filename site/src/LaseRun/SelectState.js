this.LaseRun = this.LaseRun || {};

(function(undefined) {
    "use strict";

    var SelectState = function() {
        this.objects = {};
        this._cachedValues = {};
    }

    LaseRun.extend(SelectState, LaseRun.GameState);

    var p = SelectState.prototype;

    p.preload = function() {
        var assets = LaseRun.path.assets;

        this.load.json("SelectState/rules", assets.level.child("SelectState/rules.json"));

        this.load.image("SelectState/ui/soundButton/active", assets.common.child("ui/soundButton.png"));
        this.load.image("SelectState/ui/soundButton/inactive", assets.common.child("ui/soundButtonInactive.png"));
        this.load.image("SelectState/ui/musicButton/active", assets.common.child("ui/musicButton.png"));
        this.load.image("SelectState/ui/musicButton/inactive", assets.common.child("ui/musicButtonInactive.png"));
        this.load.image("SelectState/ui/backButton", assets.common.child("ui/backButton.png"));
        this.load.spritesheet("SelectState/ui/button", assets.common.child("spritesheet/button.png"), 186, 64);

        this.load.image("SelectState/ui/background", assets.common.child("ui/background.png"));
    }

    p.create = function() {
        this.add.tween(this.world).to({alpha: 1}, 400, Phaser.Easing.Quadratic.InOut, true, 0, 0, false);

        var center = {
            x: this.stage.bounds.width / 2, 
            y: this.stage.bounds.height / 2
        }

        var background = this.objects["background"] = this.add.sprite(0, 0, "SelectState/ui/background");
        LaseRun.scaler(background, "texture").scale(this.stage.bounds);

        var rules = this.cache.getJSON("SelectState/rules");

        var genButton = function(name) {
            var buttonName = name + "Button";
            var buttonRules = rules["ui"][buttonName];
            var position = buttonRules["position"];
            var size = buttonRules["size"];

            var enabledName = name + "Enabled";

            var b = this.objects[buttonName] = this.add.sprite(
                position["x"], 
                position["y"], 
                "SelectState" + "/ui/" + buttonName + "/" + (LaseRun.settings[enabledName] ? "active" : "inactive")
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
                b.loadTexture(("SelectState/ui/" + buttonName +"/") + (LaseRun.settings[enabledName] ? "active" : "inactive"));
            }, this);

            b.fixedToCamera = true;
        }

        genButton.call(this, "music");
        genButton.call(this, "sound");

        var position = rules["ui"]["backButton"]["position"];
        var size = rules["ui"]["backButton"]["size"];

        var b = this.objects["backButton"] = this.add.sprite(position["x"], position["y"],  "SelectState/ui/backButton");
        b.anchor.setTo(0.5);
        LaseRun.scaler(b, "texture").scale(size);
        b.fixedToCamera = true;
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
            b.inputEnabled = false;
            var tween = this.add.tween(this.world).to({alpha: 0}, 1000, Phaser.Easing.Quadratic.InOut, false, 0, 0, false);
            tween.onComplete.add(function() {
                this.state.add("MainMenuState", new LaseRun.MainMenuState());
                this.state.start("MainMenuState");
            }, this);
            tween.start();
        }, this);

        var buttonsGroup = this.add.group();
        var buttonStyle = {
            font: "25px monospace", 
            fill: "white"
        }
        
        var genLevelButton = function(levelName) {
            var b = this.add.labelButton(0, 0, "SelectState/ui/button", 
                buttonStyle, 
                function() {
                    buttonsGroup.setAll("inputEnabled", false);
                    var tween = this.add.tween(this.world).to({alpha: 0}, 1000, Phaser.Easing.Quadratic.InOut, false, 0, 0, false);
                    tween.onComplete.add(function() {
                        this.state.add(levelName + "State", new LaseRun[levelName + "State"]());
                        this.state.start(levelName + "State");
                    }, this);
                    tween.start();
                }, 
                this, 0, 1, 2, 1
            );
            b.setText(levelName);
            buttonsGroup.add(b);
            return b;
        }

        var skyland = genLevelButton.call(this, "Skyland");
        skyland.x = center.x - 186 / 2;
        skyland.y = center.y - 100;
        skyland.fixedToCamera = true;

        var purpleland = genLevelButton.call(this, "Purpleland");
        purpleland.x = center.x - 186 / 2;
        purpleland.y = center.y;
        purpleland.fixedToCamera = true;

        var spaceland = genLevelButton.call(this, "Spaceland");
        spaceland.x = center.x - 186 / 2;
        spaceland.y = center.y + 100;
        spaceland.fixedToCamera = true;
    }

    p.update = function() {
        LaseRun.update();
    }

    p.render = function() {
    }

    LaseRun.SelectState = SelectState;

})();