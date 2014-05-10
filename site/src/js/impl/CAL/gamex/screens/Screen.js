this.CAL = this.CAL || {};

this.CAL.gamex = this.CAL.gamex || {};

this.CAL.gamex.screens = this.CAL.gamex.screens || {};

(function(undefined) {
	"use strict";
	
	var Screen = function() {
		Screen.super.forEach(function(base) { base.call(this); });
	}
	
	CAL.lang.extend(Screen, CAL.lang.IUpdateableObject);
	CAL.lang.extend(Screen, CAL.graphics.IDrawableObject);
	
	var p = Screen.prototype;
	
	p.show = function(params) {
	}
	
	p.hide = function(params) {	
	}
	
	CAL.gamex.screens.Screen = Screen;
	
})();