this.CAL = this.CAL || {};

this.CAL.gamex = this.CAL.gamex || {};

(function(undefined) {
	"use strict";
	
	/*
	var Keys = {
		DELTA: "delta",
		UPDATEPARAMS: "update_params",
		FPS_TIME: "fps_time",
		FONT: "font",
		SPRITE_MANAGER: "sprite_manager",
		Sprites: {
			SKY: "skyland_sky",
			SOIL: "skyland_ground",
			GROUND: "skyland_floor",
			GROUND_2: "ground2"
		},
	};
	*/
	
	
	
	var Game = function(resources, screen) {
		Game.super[0].call(this);
		this.cache["d"] = 0;
		this.setScreen(screen);
		this.setFPSShown(true);
		this.setFPSColor(CAL.graphics.Colors.WHITE);
		this.setFPSFont(undefined);
		this.setClearColor(CAL.graphics.Colors.BLACK);
		this.setFPSLocation(50, 50);
		this.setFPSUpdateInterval(CAL.gamex.TARGET_UPDATE_FPS);
		this._newScreenShown = true;
	}
	
	CAL.lang.extend(Game, CAL.lang.CachingObject);
	
	var p = Game.prototype;
	
	p.setScreen = function(screen) {
		if (screen != this._screen) {
			this._newScreenShown = true;
		}
		this._lastScreen = this._screen;
		this._screen = screen;
	}
	
	p.getScreen = function() {
		return this._screen;
	}
	
	p.setFPSShown = function(val) {
		this._showFPS = val;
	}
	
	p.isFPSShown = function(val) {
		return this._showFPS ? true : false;
	}
	
	p.getShownFPS = function() {
		return this.cache[Keys.DELTA];
	}
	
	p.setFPSColor = function(color) {
		this._fpsColor = color;
	}
	
	p.getFPSColor = function() {
		return this._fpsColor;
	}
	
	p.setFPSFont = function(font) {
		this._fpsFont =  font
	}
	
	p.getFPSFont = function() {
		return this._fpsFont;
	}
	
	p.setClearColor = function(color) {
		this._clearColor = color;
	}
	
	p.getClearColor = function() {
		return this._clearColor;
	}
	
	p.setFPSLocation = function(x, y) {
		if (typeof y === "undefined") {
			y = x.y;
			x = x.x;
		}
		this._fpsLocation = {x: x, y: y};
	}
	
	p.getFPSLocation = function() {
		return this._fpsLocation;
	}
	
	p.setFPSUpdateInterval = function(interval) {
		this._fpsUpdateInterval = interval;
		if (this.cache["f"]) {
			this.cache["f"].setInterval(interval);
		}
	}
	
	p.getFPSUpdateInterval = function() {
		return this._fpsUpdateInterval;
	}
	
	p.update = function(updateParams) {
		var delta = updateParams.tickEvent.delta;
		this.cache["u"] = updateParams;
		
		if (updateParams.first) {
			var fps = this.getFPSUpdateInterval();
			this.cache["f"] = new CAL.util.DeltaTimer(fps, fps)
				.postCallback(function() {
					this.cache["d"] = this.cache["u"].tickEvent.delta;
				}, this);
		}
		this.cache["f"].update(delta);
		
		var s = this.getScreen();
		if (s) {
			if (this._newScreenShown) {
				if (this._lastScreen) {
					this._lastScreen.hide();
					this._lastScreen = undefined;
				}
				updateParams.first = true;
				s.show(updateParams);
				this._newScreenShown = false;
			}
			s.update(updateParams);
		}
	}
	
	p.draw = function(renderParams) {
		var canvas = renderParams.canvas;
		var context = canvas.getContext("2d");
		
		// Clear screen
		context.fillStyle = this.getClearColor();
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		var s = this.getScreen();
		if (s) {
			s.draw(renderParams);
		}
		
		(function () {
			if (!this.isFPSShown()) {
				return;
			}
			var color = this.getFPSColor();
			if (!color) {
				return;
			}
			var font = this.getFPSFont();
			if (font) {
				context.font = font;
			}
			context.fillStyle = color;
			var delta = this.cache["d"];
			var l = this.getFPSLocation();
			context.fillText(delta == 0 ? "Infinite" : Math.floor(1000 / delta).toString(), l.x, l.y);
		}).call(this);
	};
	
	CAL.gamex.Game = Game;
	
})();