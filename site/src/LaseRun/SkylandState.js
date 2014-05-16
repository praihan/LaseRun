this.LaseRun = this.LaseRun || {};

(function(undefined) {
    "use strict";

    var SkylandState = function() {
        this.sprites = {};
        this.layers = {};
    }

    LaseRun.extend(SkylandState, LaseRun.GameState);

    var p = SkylandState.prototype;

    p.preload = function() {
        var assets = LaseRun.path.assets;
        this.load.tilemap("skyland/map", assets.img.child("skyland/map.json"), null, Phaser.Tilemap.TILED_JSON);
        this.load.image("skyland/map/sky", assets.img.child("skyland/sky.png"));
        this.load.image("skyland/map/tiles", assets.img.child("skyland/tiles.png"));


    }

    p.create = function() {
        this.cursors = this.input.keyboard.createCursorKeys();

        var map = this.map = this.add.tilemap("skyland/map");
        map.addTilesetImage("tiles", "skyland/map/tiles");
        map.addTilesetImage("sky", "skyland/map/sky");

        var sky = map.createLayer("sky");
        var ground = map.createLayer("tiles");

        sky.resizeWorld();
        this.camera.x = 0;
        this.camera.y = map.heightInPixels;
    }

    p.update = function() {
        var cursors = this.cursors;

        var left = cursors.left.isDown;
        var right = cursors.right.isDown;
        var down = cursors.down.isDown;
        var up = cursors.up.isDown;

        if (left ^ right) {
            this.camera.x += left ? -8 : 8;
        }
        if (up ^ down) {
            this.camera.y += up ? -8 : 8;
        }
    }

    p.render = function() {
    }

    LaseRun.SkylandState = SkylandState;

})();