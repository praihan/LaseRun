this.CAL = this.CAL || {};

this.CAL.Gamex = this.CAL.Gamex || {};

(function() {
	"use strict";
	
	CAL.Gamex.TARGET_FPS = CAL.Gamex.TARGET_FPS || 60;
	CAL.Gamex.TARGET_UPDATE_FPS = CAL.Gamex.TARGET_UPDATE_FPS || 1000;
	
	var Keys = {
		DELTA: 0,
		UPDATEPARAMS: 1,
		SPRITE: 2,
		FPS_TIME: 3
	}
	
	
	
	
	var Game = function(resources) {	
		this._lastFPSUpdate = CAL.Gamex.TARGET_UPDATE_FPS;
		this.cache[Keys.DELTA] = 0;
	}
	
	var p = Game.prototype = new CAL.Lang.CachingObject();
	
	p.update = function(updateParams) {
		var delta = updateParams.event.delta;
		this.cache[Keys.UPDATEPARAMS] = updateParams;
		
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
					width: 500, 
					height: 500
				}, 
				clipping: {
					x: 0,
					y: 50
				}, 
				rotation: 0.1,
				flip: {x: false, y: false}
			});
			*/
			var sheet = new CAL.Graphics.SpriteSheet({
				image: updateParams.resources.getResult("temp"), 
				padding: {
					x: 0,
					y: 0
				},
				tile: {
					width: 600 / 5,
					height: 350 / 2
				}
			});
			this.cache[Keys.SPRITE] = sheet.spriteAt(0, 0);

			var fps = CAL.Gamex.TARGET_UPDATE_FPS;
			this.cache[Keys.FPS_TIMER] = new CAL.Util.DeltaTimer(fps, fps)
				.postCallback(
					function() {
						this.cache[Keys.DELTA] = this.cache[Keys.UPDATEPARAMS].event.delta;
					}, 
					this);
		}
		this.cache[Keys.FPS_TIMER].update(delta);
	}
	
	p.draw = function(renderParams) {
		var canvas = renderParams.canvas;
		var context = canvas.getContext("2d");
		
		context.fillStyle = CAL.Graphics.Colors.BLACK;
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		context.font = CAL.Graphics.getFont("Ubuntu Mono", 50, [CAL.Graphics.FontStyles.BOLD, CAL.Graphics.FontStyles.ITALIC]);	
		context.fillStyle = CAL.Graphics.Colors.WHITE;
		
		var delta = this.cache[Keys.DELTA];
		context.fillText(delta == 0 ? "Infinite" : Math.floor(1000 / delta).toString(), 200, 50);
		
		this.cache[Keys.SPRITE].draw(context);
	};
	
	CAL.Gamex.Game = Game;
	
})();