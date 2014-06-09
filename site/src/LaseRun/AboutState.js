this.LaseRun = this.LaseRun || {};

(function(undefined) {
    "use strict";

    var AboutState = function() {
        this.objects = {};
        this._cachedValues = {};
    }

    LaseRun.extend(AboutState, LaseRun.GameState);

    var p = AboutState.prototype;

    p.preload = function() {
        var assets = LaseRun.path.assets;

        this.load.json("AboutState/info", assets.level.child("AboutState/info.json"));
        this.load.json("AboutState/rules", assets.level.child("AboutState/rules.json"));

        this.load.image("AboutState/ui/soundButton/active", assets.common.child("ui/soundButton.png"));
        this.load.image("AboutState/ui/soundButton/inactive", assets.common.child("ui/soundButtonInactive.png"));
        this.load.image("AboutState/ui/musicButton/active", assets.common.child("ui/musicButton.png"));
        this.load.image("AboutState/ui/musicButton/inactive", assets.common.child("ui/musicButtonInactive.png"));
        this.load.image("AboutState/ui/backButton", assets.common.child("ui/backButton.png"));

        this.load.image("AboutState/ui/background", assets.common.child("ui/background.png"));
    }

    p.create = function() {
        this.add.tween(this.world).to({alpha: 1}, 400, Phaser.Easing.Quadratic.InOut, true, 0, 0, false);

        var background = this.objects["background"] = this.add.sprite(0, 0, "AboutState/ui/background");
        LaseRun.scaler(background, "texture").scale(this.stage.bounds);

        var rules = this.cache.getJSON("AboutState/rules");

        var genButton = function(name) {
            var buttonName = name + "Button";
            var buttonRules = rules["ui"][buttonName];
            var position = buttonRules["position"];
            var size = buttonRules["size"];

            var enabledName = name + "Enabled";

            var b = this.objects[buttonName] = this.add.sprite(
                position["x"], 
                position["y"], 
                "AboutState" + "/ui/" + buttonName + "/" + (LaseRun.settings[enabledName] ? "active" : "inactive")
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
                b.loadTexture(("AboutState/ui/" + buttonName +"/") + (LaseRun.settings[enabledName] ? "active" : "inactive"));
            }, this);

            b.fixedToCamera = true;
        }

        genButton.call(this, "music");
        genButton.call(this, "sound");

        var position = rules["ui"]["backButton"]["position"];
        var size = rules["ui"]["backButton"]["size"];

        var b = this.objects["backButton"] = this.add.sprite(position["x"], position["y"],  "AboutState/ui/backButton");
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

        var info = this.cache.getJSON("AboutState/info");
        var t = this.add.text(this.stage.bounds.width / 2, this.stage.bounds.height / 2, info["text"], info["style"]);
        t.anchor.setTo(0.5);
        t.fixedToCamera = true;
    }

    p.update = function() {
        LaseRun.update();
    }

    p.render = function() {
    }

    LaseRun.AboutState = AboutState;

})();