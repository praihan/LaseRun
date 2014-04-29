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
		DELTA: "delta",
		UPDATEPARAMS: "update_params",
		FPS_TIME: "fps_time",
		FONT: "font",
		SPRITE_MANAGER: "sprite_manager",
		Sprites: {
			SKY: "sky",
			SOIL: "soil",
			GROUND: "ground",
			GROUND_2: "ground2"
		},
	};
	
	
	
	
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
			
			var sm = this.cache[Keys.SPRITE_MANAGER] = new CAL.graphics.SpriteManager();
			
			/*
			sm.pushSprite(new CAL.graphics.Sprite({
				image: updateParams.resources.getResult("sky"),
			}), Keys.Sprites.SKY);
			
			sm.pushSprite(new CAL.graphics.Sprite({
				image: updateParams.resources.getResult("dirt_soil_1"),
			}), Keys.Sprites.SOIL);
			
			sm.pushSprite(new CAL.graphics.Sprite({
				image: updateParams.resources.getResult("grass_ground_1"),
			}), Keys.Sprites.GROUND);
			
			sm.pushSprite(sm.getSprite(Keys.Sprites.GROUND).clone(), Keys.Sprites.GROUND_2);
			
			*/
			
			sm.pushSprite(new CAL.graphics.ParallaxSprite({
				image: updateParams.resources.getResult("sky"),
			}), Keys.Sprites.SKY);
			
			var fps = CAL.gamex.TARGET_UPDATE_FPS;
			this.cache[Keys.FPS_TIMER] = new CAL.util.DeltaTimer(fps, fps)
				.postCallback(
					function() {
						this.cache[Keys.DELTA] = this.cache[Keys.UPDATEPARAMS].tickEvent.delta;
					}, 
					this);
			this.cache[Keys.FONT] = CAL.graphics.getFont("Ubuntu Mono", 50, [CAL.graphics.FontStyles.BOLD, CAL.graphics.FontStyles.ITALIC]);
		}
		
		var sm = this.cache[Keys.SPRITE_MANAGER];
		
		var test = sm.getSprite(Keys.Sprites.SKY);
		
		test.
		
		this.cache[Keys.FPS_TIMER].update(delta);
		var viewport = updateParams.viewport;
		/*
		var skySprite = sm.getSprite(Keys.Sprites.SKY);
		skySprite.scaleTo(updateParams.viewport);
		
		var soilSprite = sm.getSprite(Keys.Sprites.SOIL);
		soilSprite.scaleWidthTo(viewport.x);
		soilSprite.scaleHeightTo(viewport.y / 4);
		soilSprite.setY(viewport.y - soilSprite.getHeight());
		
		var groundSprite = sm.getSprite(Keys.Sprites.GROUND);			
		groundSprite.scaleWidthTo(viewport.x / 2);
		groundSprite.scaleHeightTo(viewport.y / 50);
		groundSprite.setY(soilSprite.getY() - groundSprite.getHeight());
		
		
		var groundSprite2 = sm.getSprite(Keys.Sprites.GROUND_2);
		groundSprite2.scaleWidthTo(viewport.x / 2);
		groundSprite2.scaleHeightTo(viewport.y / 50);
		groundSprite2.setY(groundSprite.getY());
		groundSprite2.setX(groundSprite.getX() + groundSprite.getWidth());
		*/
	}
	
	p.draw = function(renderParams) {
		var canvas = renderParams.canvas;
		var context = canvas.getContext("2d");
		
		// Clear screen
		context.fillStyle = CAL.graphics.Colors.BLACK;
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		this.cache[Keys.SPRITE_MANAGER].draw(context);
		
		context.font = this.cache[Keys.FONT];
		context.fillStyle = CAL.graphics.Colors.BLACK;
		var delta = this.cache[Keys.DELTA];
		context.fillText(delta == 0 ? "Infinite" : Math.floor(1000 / delta).toString(), 50, 50);
	};
	
	CAL.gamex.Game = Game;
	
})();