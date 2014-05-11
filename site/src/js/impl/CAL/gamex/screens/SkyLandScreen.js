this.CAL = this.CAL || {};

this.CAL.gamex = this.CAL.gamex || {};

this.CAL.gamex.screens = this.CAL.gamex.screens || {};

(function(undefined) {
	"use strict";
	
	var LEVEL_NAME = "skyland";
	
	var SkyLandScreen = function() {
		SkyLandScreen.super[0].call(this, LEVEL_NAME);
	}
	
	CAL.lang.extend(SkyLandScreen, CAL.gamex.screens.LevelScreen);
	
	var p = SkyLandScreen.prototype;
	
	p.update = function(params) {
		if (params.first) {
			var dm = this._dm = new CAL.graphics.DrawableManager();
			
			var lvl = this.getLevelName();
			
			var res = function(name) {
				return params.resources.getResult(lvl + "/" + name);
			}
			
			dm.pushDrawable(new CAL.objects.TexturedObject(new CAL.graphics.ParallaxSprite({
				image: res("sky"),
			})), "sky");
			
			dm.pushDrawable(new CAL.objects.TexturedObject(new CAL.graphics.ParallaxSprite({
				image: res("ground"),
			})), "ground");
			
			dm.pushDrawable(new CAL.objects.TexturedObject(new CAL.graphics.ParallaxSprite({
				image: res("floor"),
			})), "floor");
			
			dm.pushDrawable(new CAL.objects.TexturedObject(new CAL.graphics.ParallaxSprite({
				image: res("floor"),
			})), "floor2");
		}
		
		var delta = params.tickEvent.delta;
		
		var dm = this._dm;
		
		var right = params.keyboard.isDown("right");
		var left = params.keyboard.isDown("left");
		
		var scrollVel = right ^ left ? right ? 3e-1 : -3e-1 : 0;	
		
		var viewport = params.viewport;
		
		var sky = dm.getDrawable("sky");
		sky.scaleTo(params.viewport);
		
		var ground = dm.getDrawable("ground");
		ground.scaleWidthTo(viewport.x);
		ground.scaleHeightTo(viewport.y / 4);
		ground.setY(viewport.y - ground.getHeight());
		
		var floor = dm.getDrawable("floor");			
		floor.scaleWidthTo(viewport.x / 2);
		floor.scaleHeightTo(viewport.y / 50);
		floor.setY(ground.getY() - floor.getHeight());
		
		var floor2 = dm.getDrawable("floor2");
		floor2.scaleWidthTo(viewport.x / 2);
		floor2.scaleHeightTo(viewport.y / 50);
		floor2.setY(floor.getY());
		floor2.setX(floor.getX() + floor.getWidth());
		
		if (scrollVel) {
			var baseWidth = sky.getTexture()._image.width;
			var s = function(spr, modifier) {
				spr.getTexture().scrollX(scrollVel * delta * (spr.getTexture()._image.width / baseWidth) * (modifier ? modifier : 1));
			}
			s(sky, 0.3)
			s(floor, 2);
			s(floor2, 2);
			s(ground);
		}
	}
	
	p.draw = function(params) {
		this._dm.draw(params);
	}
	
	CAL.gamex.screens.SkyLandScreen = SkyLandScreen;
	
})();