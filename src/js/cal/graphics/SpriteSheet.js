this.CAL = this.CAL || {};

this.CAL.Graphics = this.CAL.Graphics || {};

(function() {
	"use strict";
	
	var SpriteSheet = function(params) {
		if (!params.image) {
			throw new CAL.Lang.CALException("No image source");
		}
		this._image = params.image;
		this._padding = params.padding ? 
						new CAL.Graphics.Vector2(params.padding.x, params.padding.y) : 
						new CAL.Graphics.Vector2(0, 0);
		this._clipping = params.clipping ?
						new CAL.Graphics.Vector2(params.clipping.x, params.clipping.y) : 
						new CAL.Graphics.Vector2(0, 0);
		this._tile = params.tile ?
						new CAL.Graphics.Vector2(params.tile.width, params.tile.height) : 
						new CAL.Graphics.Vector2(this._image.width, this._image.height);
	}
	
	var p = SpriteSheet.prototype = new CAL.Lang.CachingObject();
	
	var cutImage = function (image, x, y, width, height) {
  		var canvas = document.createElement("canvas");
  		canvas.width = width;
  		canvas.height = height;
  		
  		var context = canvas.getContext("2d");
  		context.drawImage(image, x, y, width, height, 0, 0, canvas.width, canvas.height);
  		
  		return canvas;
	};
	
	p.spriteAt = function(x, y) {
		if (typeof y === "undefined") {
			y = x.y;
			x = x.x;
		}
		var str = x.toString() + ", " + y.toString();
		var img = this.cache[str]
		if (img) {
			return img;
		}
		return this.cache[str] = new CAL.Graphics.Sprite({
			image: cutImage(this._image, 0, 0, 50, 50)
		});
	}
	
	CAL.Graphics.SpriteSheet = SpriteSheet;
	
})();