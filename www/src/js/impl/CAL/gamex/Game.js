this.CAL = this.CAL || {};

this.CAL.gamex = this.CAL.gamex || {};

(function(undefined) {
	"use strict";
	
	CAL.gamex.TARGET_FPS = CAL.gamex.TARGET_FPS || 60;
	CAL.gamex.TARGET_UPDATE_FPS = CAL.gamex.TARGET_UPDATE_FPS || 1000;
	CAL.gamex.ASPECT_RATIO_Y = 16;
	CAL.gamex.ASPECT_RATIO_X = 9;
	CAL.gamex.ASPECT_RATIO = CAL.gamex.ASPECT_RATIO_Y / CAL.gamex.ASPECT_RATIO_X;
	
	var Keys = {
		DELTA: 0,
		UPDATEPARAMS: 1,
		FPS_TIME: 2,
		FONT: 3,
		SPRITE_SKY: 4,
		SPRITE_GROUND: 5,
	}
	
	
	
	
	var Game = function(resources) {
		CAL.lang.extend(this, new CAL.lang.CachingObject());
		this._lastFPSUpdate = CAL.gamex.TARGET_UPDATE_FPS;
		this.cache[Keys.DELTA] = 0;
	}
	
	var p = Game.prototype;
	
	p.update = function(updateParams) {
		var delta = updateParams.tickEvent.delta;
		this.cache[Keys.UPDATEPARAMS] = updateParams;
		var canvas = updateParams.canvas;
		
		if (updateParams.first) {
			jQuery(canvas).css("background-color", CAL.graphics.Colors.BLACK);
			
			this.cache[Keys.SPRITE_SKY] = new CAL.graphics.Sprite({
				image: updateParams.resources.getResult("sky"),
			});
			
			this.cache[Keys.SPRITE_GROUND] = new CAL.graphics.Sprite({
				image: updateParams.resources.getResult("dirt_ground_1"),
			});
			
			console.log(this.cache[Keys.SPRITE_SKY]);

			var fps = CAL.gamex.TARGET_UPDATE_FPS;
			this.cache[Keys.FPS_TIMER] = new CAL.util.DeltaTimer(fps, fps)
				.postCallback(
					function() {
						this.cache[Keys.DELTA] = this.cache[Keys.UPDATEPARAMS].tickEvent.delta;
					}, 
					this);
			this.cache[Keys.FONT] = CAL.graphics.getFont("Ubuntu Mono", 50, [CAL.graphics.FontStyles.BOLD, CAL.graphics.FontStyles.ITALIC]);
		}
		
		this.cache[Keys.FPS_TIMER].update(delta);
		var viewport = updateParams.viewport;
		
		var skySprite = this.cache[Keys.SPRITE_SKY];
		skySprite.scaleTo(updateParams.viewport);
		
		var groundSprite = this.cache[Keys.SPRITE_GROUND];
		groundSprite.scaleWidthTo(viewport.x);
		groundSprite.scaleHeightTo(viewport.y / 4);
		
		groundSprite.setY(viewport.y - groundSprite.getHeight());
	}
	
	p.draw = function(renderParams) {
		var canvas = renderParams.canvas;
		var context = canvas.getContext("2d");
		
		// Clear screen
		context.fillStyle = CAL.graphics.Colors.BLACK;
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		this.cache[Keys.SPRITE_SKY].draw(context);
		this.cache[Keys.SPRITE_GROUND].draw(context);
		
		context.font = this.cache[Keys.FONT];
		context.fillStyle = CAL.graphics.Colors.BLACK;
		var delta = this.cache[Keys.DELTA];
		context.fillText(delta == 0 ? "Infinite" : Math.floor(1000 / delta).toString(), 50, 50);
	};
	
	CAL.gamex.Game = Game;
	
})();