this.CAL = this.CAL || {};

this.CAL.Graphics = this.CAL.Graphics || {};

(function() {
	"use strict";
	
	var ImageOrigin = {
		Image: "image",
		SpriteSheet: "spritesheet",
	}
	
	var Sprite = function(params) {
		this._setDimensions(params.dimensions || {x: 0, y: 0, width: 0, height: 0});
		var d = this._getDimensions();
		this.setClipping(params.clipping || d);
		this.setRotation(params.rotation || 0);
		this.setOrigin(params.origin || {x: d.width / 2, y: d.height / 2});
		this.setFlip(params.flip || {x: false, y: false});
		
		if (params.image) {
			this._image = params.image;
			if (!params.dimensions) {
					this._setDimensions({
					x: this._image.x, 
					y: this._image.y, 
					width: this._image.width, 
					height: this._image.height
				});
			}
			this._imageOrigin = ImageOrigin.Image;
			return;
		}
		if (params.sprite) {
			var sprite = params.sprite;
			this._image = sprite._image;
			this._imageOrigin = sprite._imageOrigin;
			if (!params.dimensions) {
				this._setDimensions(sprite._getDimensions());
			}
			if (!params.clipping) {
				this.setClipping(sprite.getClipping());
			}
			if (!params.rotation) {
				this.setRotation(sprite.getRotation());
			}
			if (!params.origin) {
				this.setOrigin(sprite.getOrigin());
			}
			if (!params.flip) {
				this.setFlip(sprite._getFlip());
			}
			return;
		}
		if (params.spritesheet) {
			var ss = params.spritesheet;
			if (!ss.sheet) {
				throw new CAL.Lang.CALException("No sheet specified for spritesheet option");
			}
			if (!ss.x || !ss.y) {
				throw new CAL.Lang.CALException("Bad coordinate for image on spritesheet");
			}
			
			
			
			
			// spritesheet code here
			
			
			
			
			return;
		}
		throw new CAL.Lang.CALException("No image source specified");
	}
	
	var p = Sprite.prototype = new CAL.Graphics.DisplayObject();
	var s = Sprite;
	
	
	
	
	p._getDimensions = function() {
		var l = this.getLocation();
		var s = this.getSize();
		return {x: l.x, y: l.y, width: s.x, height: s.y};
	}
	
	p._setDimensions = function(d) {
		this.setLocation(d.x, d.y);
		this.setSize(d.width, d.height);
	}
	
	p.getClipping = function() {
		return this._clipping;
	}
	
	p.setClipping = function(x, y) {
		if (!y) {
			this._clipping = new CAL.Graphics.Vector2(x.x || 0, x.y || 0);
		} else {
			this._clipping = new CAL.Graphics.Vector2(x || 0, y);
		}
	}
	
	p.setClippingX = function(x) {
		this._clipping.x = x;
	}
	
	p.setClippingY = function(y) {
		this._clipping.y = y;
	}
	
	p.setRotation = function(radians) {
		this._rotation = radians;
	}
	
	p.getRotation = function() {
		return this._rotation;
	}
	
	p.getOrigin = function() {
		return this._origin;
	}
	
	p.setOrigin = function(x, y) {
		if (!y) {
			this._origin = new CAL.Graphics.Vector2(x.x || 0, x.y || 0);
		} else {
			this._origin = new CAL.Graphics.Vector2(x || 0, y);
		}
	}
	
	p.setOriginX = function(x) {
		this._origin.x = x;
	}
	
	p.setOriginY = function(y) {
		this._origin.y = y;
	}
	
	p.setFlip = function(boolX, boolY) {
		if (typeof boolY === "undefined") {
			this._flip = {x: boolX.x, y: boolX.y};
			return;
		}
		this._flip = {x: boolX, y: boolY};
	}
	
	p._getFlip = function() {
		return this._flip;
	}
	
	p.flip = function(boolX, boolY) {
		if (typeof boolY === "undefined") {
			if (typeof boolX === "undefined") {
				boolX = boolY = true;
			} else {
				boolY = boolX.y;
				boolX = boolX.x;
			}
		}
		if (boolX) {
			this._flip.x ^= true;
		}
		if (boolY) {
			this._flip.y ^= true;
		}
	}
	
	p.flipX = function() {
		this.flip(true, false);
	}
	
	p.flipY = function() {
		this.flip(false, true);
	}
	
	p.draw = function(context) {
		context.save();
		if (this._imageOrigin == ImageOrigin.Image) {
			var c = this.getClipping();
			var d = this._getDimensions();
			var r = this.getRotation();
			var f = this._getFlip();
			
			var position;
			if (r != 0) {
				var o = this.getOrigin();
				context.translate(d.x + o.x, d.y + o.y);
				context.rotate(r);
				position = {
					x: -d.width / 2,
					y: -d.height / 2
				}
			} else {
				position = {
					x: d.x,
					y: d.y
				}
			}
			
			context.scale(f.x ? -1 : 1, f.y ? -1 : 1);
			context.drawImage(this._image, c.x, c.y, d.width, d.height, position.x, position.y, d.width, d.height);
		}
		context.restore();
	}
	
	p.clone = function() {
		return new Sprite({sprite: this});
	}
	
	CAL.Graphics.Sprite = Sprite;
	
})();