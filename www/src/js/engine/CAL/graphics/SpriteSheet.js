this.CAL = this.CAL || {};

this.CAL.Graphics = this.CAL.Graphics || {};

(function(undefined) {
	"use strict";
	
	var SpriteSheet = function(params) {
		if (!params.image) {
			throw new CAL.Lang.CALException("No image source");
		}
		this._image = params.image;
		this._padding = params.padding ? 
						CAL.Graphics.Vector2(params.padding.x || 0, params.padding.y || 0) : 
						CAL.Graphics.Vector2(0, 0);
		this._clipping = params.clipping ? 
						CAL.Graphics.Vector2(params.clipping.x || 0, params.clipping.y || 0) : 
						CAL.Graphics.Vector2(0, 0);
		this._tile = params.tile ?
						CAL.Graphics.Vector2(params.tile.width || this._image.width, params.tile.height || this._image.width) : 
						CAL.Graphics.Vector2(this._image.width, this._image.height);
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
		var str = x.toString() + "," + y.toString();
		var img = this.cache[str];
		if (img) {
			return img;
		}
		var p = this._padding;
		var t = this._tile;
		var c = this._clipping;
		return this.cache[str] = new CAL.Graphics.Sprite({
			image: cutImage(this._image, 
							(x + 1) * p.x + x * t.x + c.x, 
							(y + 1) * p.y + y * t.y + c.x, 
							t.x, 
							t.y)
		});
	}
	
	CAL.Graphics.SpriteSheet = SpriteSheet;
	
})();