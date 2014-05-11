this.CAL = this.CAL || {};

this.CAL.graphics = this.CAL.graphics || {};

(function(undefined) {
	"use strict";
	
	var TWO_PI = Math.PI * 2;
	
	var Sprite = function(params) {
		Sprite.super[0].call(this);		
		if (typeof params === "undefined") {
			throw CAL.lang.exception("undefined", "Undefined paramaters");
		}
		this.setLocation(params.location || {x: 0, y: 0});
		this.setSize(params.size || {width: 0, height: 0});
		var l = this.getLocation();
		this.setClipping(params.clipping || {x: 0, y: 0});
		this.setRotation(params.rotation || 0);
		this.setFlip(params.flip || {x: false, y: false});
		
		if (params.image) {
			this._image = params.image;
			if (!params.size) {
				this.setSize({
					x: this._image.width, 
					y: this._image.height
				});
			}
			if (!params.location) {
				this.setLocation(0, 0);
			}
			var s = this.getSize();
			return;
		} else if (params.sprite) {
			var sprite = params.sprite;
			this._image = sprite._image;
			if (typeof params.location === "undefined") {
				this.setLocation(sprite.getLocation());
			}
			if (typeof params.size === "undefined") {
				this.setSize(sprite.getSize());
			}
			if (typeof params.clipping === "undefined") {
				this.setClipping(sprite.getClipping());
			}
			if (typeof params.rotation === "undefined") {
				this.setRotation(sprite.getRotation());
			}
			if (typeof params.flip === "undefined") {
				this.setFlip(sprite.getFlip());
			}			
			return;
		} else {
			var s = this.getSize();
		}
		throw "No image source specified";
	}
	
	CAL.lang.extend(Sprite, CAL.graphics.DisplayObject);
	
	var p = Sprite.prototype;
	var s = Sprite;
	
	s.extractImage = function(sprite) {
		var canvas = document.createElement("canvas");
  		canvas.width = sprite.getWidth();
  		canvas.height = sprite.getHeight();
  		
  		var context = canvas.getContext("2d");
  		sprite.draw(context);
		return canvas;
	}
	
	p.getClipping = function() {
		return this._clipping;
	}
	
	p.setClipping = function(x, y) {
		if (typeof y === "undefined") {
			this._clipping = CAL.graphics.Vector2(x.x, x.y);
		} else {
			this._clipping = CAL.graphics.Vector2(x, y);
		}
	}
	
	p.setClippingX = function(x) {
		this._clipping.x = x;
	}
	
	p.setClippingY = function(y) {
		this._clipping.y = y;
	}
	
	p.setRotation = function(radians) {
		this._rotation = radians % TWO_PI;
	}
	
	p.getRotation = function() {
		return this._rotation;
	}
	
	p.rotate = function(radians) {
		this._rotation = (this._rotation + radians) % TWO_PI;
	}
	
	p.setFlip = function(boolX, boolY) {
		if (typeof boolY === "undefined") {
			this._flip = {x: boolX.x, y: boolX.y};
			return;
		}
		this._flip = {x: boolX, y: boolY};
	}
	
	p.getFlip = function() {
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
		var c = this.getClipping();
		var s = this.getSize();
		var l = this.getLocation();
		var r = this.getRotation();
		var f = this.getFlip();
		
		var position;
		if (r != 0) {
			context.translate(l.x + s.x / 2, l.y + s.y / 2);
			context.rotate(r);
			position = {
				x: (-s.x) / 2,
				y: (-s.y) / 2
			}
		} else {
			position = {
				x: l.x,
				y: l.y
			}
		}
		
		context.scale(f.x ? -1 : 1, f.y ? -1 : 1);
		// context.drawImage(this._image, c.x, c.y, s.x, s.y, position.x, position.y, s.x, s.y);
		context.drawImage(
			this._image, 
			c.x, 
			c.y, 
			// this._image.width + c.x, 
			// this._image.height + c.y, 
			// s.x,s.y,
			this._image.width, 
			this._image.height, 
			position.x, 
			position.y, 
			s.x + c.x, 
			s.y + c.y);
		context.restore();
	}
	
	p.clone = function() {
		return new Sprite({sprite: this});
	}
	
	s.relativeSize = function(type) {
		var _this = this;
		switch (type.toLowerCase()) {
			case "display":
			case "screen":
				return {
					width: function(val) {
						return val.getWidth() / _this.getWidth(); 
					},
					height: function(val) {
						return val.getHeight() / _this.getHeight(); 
					}
				}
			case "image":
			case "img":
				return {
					width: function(val) {
						return val._image.width / _this._image.width; 
					},
					height: function(val) {
						return val._image.height / _this._image.height; 
					}
				}
		}
	}
	
	CAL.graphics.Sprite = Sprite;
	
})();