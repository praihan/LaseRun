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
        this.load.spritesheet("MainMenuState/button", assets.common.child("spritesheet/button.png"), 186, 64);
        this.load.image("MainMenuState/background", assets.level.child("MainMenuState/background.png"));
        // this.load.bitmapFont("MainMenuState/font", assets.common.child("bitmapFont/ubuntuMono.png"), assets.common.child("bitmapFont/ubuntuMono.fnt"));
    }

    p.create = function() {
        this.world.alpha = 1;
        var background = this.objects["background"] = this.add.sprite(0, 0, "MainMenuState/background");
        LaseRun.scaler(background, "texture").scale(this.stage.bounds);
        var clicked = false;
        var button = this.add.labelButton((this.stage.bounds.width / 2 - 186 / 2), 400, "MainMenuState/button", 
            {
                font: "50px monospace", 
                fill: "white"
            }, 
            function() {
                if (!clicked) {
                    var tween = this.add.tween(this.world).to({alpha: 0}, 1000, Phaser.Easing.Quadratic.InOut, false, 0, 0, false);
                    tween.onComplete.add(function() {
                        this.state.add("SkylandState", new LaseRun.SkylandState());
                        this.state.start("SkylandState");
                    }, this);
                    tween.start();
                }
                clicked = true;
            }, 
            this, 0, 1, 2, 1);
        button.setText("Play");
    }

    p.update = function() {
    }

    p.render = function() {
    }

    LaseRun.MainMenuState = MainMenuState;

})();