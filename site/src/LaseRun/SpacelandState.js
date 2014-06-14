this.LaseRun = this.LaseRun || {};

(function(undefined) {
    "use strict";

    var SpacelandState = function() {
        var assets = LaseRun.path.assets;
        SpacelandState.super[0].call(this, 
        {
            "name": "SpacelandState",
            "resources": {
                "rules": {path: assets.level.child("SpacelandState/rules.json")},
                "sky": {path: assets.common.child("bitmap/blackSky.png")},
                "tiles": {path: assets.common.child("spritesheet/kennyTiles.png")},
                "laserButt": {path: assets.common.child("bitmap/laserButt.png")},
                "ball": {path: assets.common.child("bitmap/redBall.png")},
                "coins": {
                    "path": assets.common.child("spritesheet/coins.png"),
                    "tileWidth": 32,
                    "tileHeight": 32,
                    "frameRate": 10
                },
                "laser": {
                    "path": assets.common.child("spritesheet/laser.png"),
                    "tileWidth": 45,
                    "tileHeight": 800,
                    "frameRate": 20
                },
                "tilemap": {
                    "path": assets.level.child("SpacelandState/map.json"),
                    "type": Phaser.Tilemap.TILED_JSON
                },
                "coinCollect": {
                    "path": {
                        "mp3": assets.common.child("audio/coinCollect.mp3"),
                        "ogg": assets.common.child("audio/coinCollect.ogg")
                    }
                },
                "ui": {
                    "backButton": {
                        "path": assets.common.child("ui/backButton.png"), 
                    },
                    "soundButton": {
                        "path": {
                            "active": assets.common.child("ui/soundButton.png"),
                            "inactive": assets.common.child("ui/soundButtonInactive.png")
                        }
                    },
                    "musicButton": {
                        "path": {
                            "active": assets.common.child("ui/musicButton.png"),
                            "inactive": assets.common.child("ui/musicButtonInactive.png")
                        }
                    },
                    "menuPanel": {
                        "path": assets.common.child("ui/mediumMenu.png")
                    },
                    "acceptButton": {
                        "path": assets.common.child("ui/acceptButton.png")
                    },
                    "denyButton": {
                        "path": assets.common.child("ui/denyButton.png")
                    },
                    "questionPanel": {
                        "path": assets.common.child("ui/mediumMenu.png")
                    },
                    "correctAnswer": {
                        "path": assets.common.child("ui/correctAnswer.png")
                    },
                    "wrongAnswer": {
                        "path": assets.common.child("ui/wrongAnswer.png")
                    },
                    "defaultAnswer": {
                        "path": assets.common.child("ui/defaultAnswer.png")
                    },
                    "questionFailPanel": {
                        "path": assets.common.child("ui/smallMenu.png")
                    },
                    "gameEndPanel": {
                        "path": assets.common.child("ui/smallMenu.png")
                    }
                }
            },
            "callbacks": {
                "collectCoin": {
                    "callback": collectCoin,
                    "context": this
                },
                "hitLaser": {
                    "callback": hitLaser,
                    "context": this
                }
            }
        }
        );
    }

    var collectCoin = function(ball, coin) {
    }

    var hitLaser = function(ball, laser) {
    }

    LaseRun.extend(SpacelandState, LaseRun.BaseLevelState);

    LaseRun.SpacelandState = SpacelandState;

})();