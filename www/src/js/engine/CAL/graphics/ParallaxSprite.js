this.CAL = this.CAL || {};

this.CAL.graphics = this.CAL.graphics || {};

(function(undefined) {
	"use strict";
	
	var TWO_PI = Math.PI * 2;
	
	var ParallaxSprite = function(params) {
		CAL.lang.extend(this, new CAL.graphics.Sprite(params));
		this.setScroll({x: 0, y: 0});
	}
	
	var p = ParallaxSprite.prototype;
	
	p.setScroll = function(s) {
		this._scroll = {x: s.x, y: s.y};
	}
	
	p.setScrollX = function(x) {
		this._scroll.x = x;
	}
	
	p.setScrollY = function(y) {
		this._scroll.y = y;
	}
	
	p.getScroll = function() {
		return this._scroll;
	}
	
	p.getScrollX = function() {
		return this.getScroll().x;
	}
	
	p.getScrollY = function() {
		return this.getScroll().y;
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
			this._image.width + c.x, 
			this._image.height + c.y, 
			// s.x,s.y,
			position.x, 
			position.y, 
			s.x, 
			s.y);
		context.restore();
	}
	
	/*
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
			this._image.width + c.x, 
			this._image.height + c.y, 
			// s.x,s.y,
			position.x, 
			position.y, 
			s.x, 
			s.y);
		context.restore();
	}
	*/
	
	CAL.graphics.ParallaxSprite = ParallaxSprite;
	
})();