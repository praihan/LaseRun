this.CAL = this.CAL || {};

this.CAL.gamex = this.CAL.gamex || {};

(function(undefined) {
	"use strict";
	
	CAL.gamex.TARGET_FPS = CAL.gamex.TARGET_FPS || 60;
	CAL.gamex.TARGET_UPDATE_FPS = CAL.gamex.TARGET_UPDATE_FPS || 1000;
	
	var Keys = {
		DELTA: 0,
		UPDATEPARAMS: 1,
		SPRITE: 2,
		FPS_TIME: 3,
		FONT: 4,
	}
	
	
	
	
	var Game = function(resources) {	
		this._lastFPSUpdate = CAL.gamex.TARGET_UPDATE_FPS;
		this.cache[Keys.DELTA] = 0;
	}
	
	var p = Game.prototype = new CAL.lang.CachingObject();
	
	p.update = function(updateParams) {
		var delta = updateParams.tickEvent.delta;
		this.cache[Keys.UPDATEPARAMS] = updateParams;
		
		if (updateParams.first) {
			var canvas = updateParams.canvas;
			jQuery(canvas).css("background-color", CAL.graphics.Colors.BLACK);
			var sheet = new CAL.graphics.SpriteSheet({
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
			var sprite = this.cache[Keys.SPRITE] = sheet.spriteAt(0, 0);
			sprite.setLocation(200, 200);

			var fps = CAL.gamex.TARGET_UPDATE_FPS;
			this.cache[Keys.FPS_TIMER] = new CAL.util.DeltaTimer(fps, fps)
				.postCallback(
					function() {
						this.cache[Keys.DELTA] = this.cache[Keys.UPDATEPARAMS].tickEvent.delta;
					}, 
					this);
			this.cache[Keys.FONT] = CAL.graphics.getFont("Ubuntu Mono", 50, [CAL.graphics.FontStyles.BOLD, CAL.graphics.FontStyles.ITALIC]);
			
			/*
			updateParams.pointer.addEventListener("click", function(evt) {
				if (evt.which === updateParams.pointer.LEFT)
					sprite.setLocation(evt.clientX, evt.clientY);
			}, this);
			*/
		}
		var keyboard = updateParams.keyboard;
		if (keyboard.down[keyboard.getKeyCode("Up")]) {
			// sprite.translate(-0.001 * delta, 0);
		} else {
		}
		
		this.cache[Keys.FPS_TIMER].update(delta);
	}
	
	p.draw = function(renderParams) {
		var canvas = renderParams.canvas;
		var context = canvas.getContext("2d");
		
		context.fillStyle = CAL.graphics.Colors.BLACK;
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		context.font = this.cache[Keys.FONT];
		context.fillStyle = CAL.graphics.Colors.WHITE;
		
		var delta = this.cache[Keys.DELTA];
		context.fillText(delta == 0 ? "Infinite" : Math.floor(1000 / delta).toString(), 200, 50);
		
		var sprite = this.cache[Keys.SPRITE];
		sprite.rotate(0.001 * renderParams.tickEvent.delta);
		sprite.draw(context);
	};
	
	CAL.gamex.Game = Game;
	
})();