this.LaseRun = this.LaseRun || {};

(function(undefined) {
    "use strict";

    var Bootstrap = {};

    var s = Bootstrap;

    s.run = function(GAMEDIV, VIEWPORT_X, VIEWPORT_Y, COMMON_DIR, LEVEL_DIR) {

        var path = LaseRun.path;

        path.assets.common = path.getPath(COMMON_DIR);
        path.assets.level = path.getPath(LEVEL_DIR);

        var preload = function() {
            this.load.audio("LaseRun/music", [path.assets.common.child("audio/music.mp3"), path.assets.common.child("audio/music.ogg")]);
        }

        var create = function() {
            LaseRun.settings.debugEnabled = true;
            if (LaseRun.game.canvas) {
                LaseRun.game.canvas.focus();
                LaseRun.game.canvas.className = "automargin";
            }
            LaseRun.music = this.add.audio("LaseRun/music");
            LaseRun.music.play();
            
            LaseRun.game.state.add("MainMenuState", new LaseRun.MainMenuState());
            LaseRun.game.state.start("MainMenuState");
        }

        var update = function() {
        }

        var render = function() {
        }

        LaseRun.game = new Phaser.Game(
            VIEWPORT_X, 
            VIEWPORT_Y, 
            Phaser.CANVAS, 
            GAMEDIV, 
            {
                preload: preload, 
                create: create, 
                update: update,
                render: render
            }
        );
    }

    LaseRun.Bootstrap = Bootstrap;

})();