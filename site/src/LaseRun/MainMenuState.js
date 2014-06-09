this.LaseRun = this.LaseRun || {};

(function(undefined) {
    "use strict";

    var MainMenuState = function() {
        this.objects = {};
        this._cachedValues = {};
    }

    LaseRun.extend(MainMenuState, LaseRun.GameState);

    var p = MainMenuState.prototype;

    p.preload = function() {
        var assets = LaseRun.path.assets;
        this.load.spritesheet("MainMenuState/ui/button", assets.common.child("spritesheet/button.png"), 186, 64);
        this.load.image("MainMenuState/ui/background", assets.common.child("ui/background.png"));

        this.load.image("MainMenuState/ui/soundButton/active", assets.common.child("ui/soundButton.png"));
        this.load.image("MainMenuState/ui/soundButton/inactive", assets.common.child("ui/soundButtonInactive.png"));
        this.load.image("MainMenuState/ui/musicButton/active", assets.common.child("ui/musicButton.png"));
        this.load.image("MainMenuState/ui/musicButton/inactive", assets.common.child("ui/musicButtonInactive.png"));

        this.load.json("MainMenuState/rules", assets.level.child("MainMenuState/rules.json"));
    }

    p.create = function() {
        this.world.alpha = 1;
        var background = this.objects["background"] = this.add.sprite(0, 0, "MainMenuState/ui/background");
        LaseRun.scaler(background, "texture").scale(this.stage.bounds);

        var buttonStyle = {
            font: "50px monospace", 
            fill: "white"
        }
        var playButton = this.add.labelButton((this.stage.bounds.width / 2 - 186 / 2), 200, "MainMenuState/ui/button", 
            buttonStyle, 
            function() {
                aboutButton.inputEnabled = false;
                playButton.inputEnabled = false;
                var tween = this.add.tween(this.world).to({alpha: 0}, 1000, Phaser.Easing.Quadratic.InOut, false, 0, 0, false);
                tween.onComplete.add(function() {
                    this.state.add("SkylandState", new LaseRun.SkylandState());
                    this.state.start("SkylandState");
                }, this);
                tween.start();
            }, 
            this, 0, 1, 2, 1
        );
        playButton.setText("Play");

        var aboutButton = this.add.labelButton((this.stage.bounds.width / 2 - 186 / 2), 400, "MainMenuState/ui/button", 
            buttonStyle, 
            function() {
                aboutButton.inputEnabled = false;
                playButton.inputEnabled = false;
                var tween = this.add.tween(this.world).to({alpha: 0}, 1000, Phaser.Easing.Quadratic.InOut, false, 0, 0, false);
                tween.onComplete.add(function() {
                    this.state.add("AboutState", new LaseRun.AboutState());
                    this.state.start("AboutState");
                }, this);
                tween.start();
            }, 
            this, 0, 1, 2, 1
        );
        aboutButton.setText("About");



        var rules = this.cache.getJSON("MainMenuState/rules");

        var genButton = function(name) {
            var buttonName = name + "Button";
            var buttonRules = rules["ui"][buttonName];
            var position = buttonRules["position"];
            var size = buttonRules["size"];

            var enabledName = name + "Enabled";

            var b = this.objects[buttonName] = this.add.sprite(
                position["x"], 
                position["y"], 
                "MainMenuState" + "/ui/" + buttonName + "/" + (LaseRun.settings[enabledName] ? "active" : "inactive")
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
                b.loadTexture(("MainMenuState/ui/" + buttonName +"/") + (LaseRun.settings[enabledName] ? "active" : "inactive"));
            }, this);

            b.fixedToCamera = true;
        }

        genButton.call(this, "music");
        genButton.call(this, "sound");
    }

    p.update = function() {
        LaseRun.update();
    }

    p.render = function() {
    }

    LaseRun.MainMenuState = MainMenuState;

})();