this.CAL = this.CAL || {};

this.CAL.Gamex = this.CAL.Gamex || {};

(function() {
	"use strict";
	
	CAL.Gamex.TARGET_FPS = CAL.Gamex.TARGET_FPS || 60;
	CAL.Gamex.TARGET_UPDATE_FPS = CAL.Gamex.TARGET_UPDATE_FPS || 1000;
	
	var DELTA_KEY = 0;
	var UPDATEPARAMS_KEY = 1;
	var SPRITE_KEY = 2;
	var FPS_TIMER_KEY = 3;
	
	
	
	var Game = function(resources) {	
		this._lastFPSUpdate = CAL.Gamex.TARGET_UPDATE_FPS;
		this.cache[DELTA_KEY] = 0;
	}
	
	var p = Game.prototype = new CAL.Lang.CachingObject();
	
	p.update = function(updateParams) {
		var delta = updateParams.event.delta;
		this.cache[UPDATEPARAMS_KEY] = updateParams;
		
		if (updateParams.first) {
			var canvas = updateParams.canvas;
			jQuery(canvas).css("background-color", CAL.Graphics.Colors.BLACK);
			/*
			var sprite = new CAL.Graphics.Sprite({
				image: updateParams.resources.getResult("temp"), 
				location: {
					x: 100, 
					y: 100, 
				}, 
				size: {
					width: 200, 
					height: 200
				}, 
				clipping: {
					x: 50,
					y: 50,
				}, 
				rotation: 0.5,
				flip: {x: true, y: false}
			});
			*/
			var sheet = new CAL.Graphics.SpriteSheet({image: updateParams.resources.getResult("temp")});
			this.cache[SPRITE_KEY] = sheet.spriteAt(0, 0);
			var fps = CAL.Gamex.TARGET_UPDATE_FPS;
			this.cache[FPS_TIMER_KEY] = new CAL.Util.DeltaTimer(fps, fps)
				.postCallback(
					function() {
						this.cache[DELTA_KEY] = this.cache[UPDATEPARAMS_KEY].event.delta;
					}, 
					this);
		}
		this.cache[FPS_TIMER_KEY].update(delta);
	}
	
	p.draw = function(renderParams) {
		var canvas = renderParams.canvas;
		var context = canvas.getContext("2d");
		
		context.fillStyle = CAL.Graphics.Colors.BLACK;
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		context.font = CAL.Graphics.getFont("Ubuntu Mono", 50, [CAL.Graphics.FontStyles.BOLD, CAL.Graphics.FontStyles.ITALIC]);	
		context.fillStyle = CAL.Graphics.Colors.WHITE;
		
		var delta = this.cache[DELTA_KEY];
		context.fillText(delta == 0 ? "Infinite" : Math.floor(1000 / delta).toString(), 200, 50);
		
		this.cache[SPRITE_KEY].draw(context);
	};
	
	CAL.Gamex.Game = Game;
	
})();