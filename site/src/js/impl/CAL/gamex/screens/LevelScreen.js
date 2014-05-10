this.CAL = this.CAL || {};

this.CAL.gamex = this.CAL.gamex || {};

this.CAL.gamex.screens = this.CAL.gamex.screens || {};

(function(undefined) {
	"use strict";
	
	var LevelScreen = function(levelName) {
		LevelScreen.super[0].call(this);
		this._levelName = levelName;
	}
	
	CAL.lang.extend(LevelScreen, CAL.gamex.screens.Screen);
	
	var p = LevelScreen.prototype;
	
	p.getLevelName = function() {
		return this._levelName;
	}
	
	CAL.gamex.screens.LevelScreen = LevelScreen;
	
})();