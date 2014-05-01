this.CAL = this.CAL || {};

this.CAL.graphics = this.CAL.graphics || {};

(function(undefined) {
	"use strict";
	
	var TWO_PI = Math.PI * 2;
	
	// var drawBase;
	
	var ParallaxSprite = function(params) {
		var base = new CAL.graphics.Sprite(params);
		// if (!drawBase) {
			// drawBase = base.draw;
		// }
		CAL.lang.extend(this, base);
		this.setScroll(0, 0);
	}
	
	var p = ParallaxSprite.prototype;
	
	p.setScroll = function(x, y) {
		if (typeof y === "undefined") {
			y = x.y;
			x = x.x;
		}
		var s = this.getSize();
		// var c = this.getClipping();
		this._scroll = {x: x % (s.x), y: y % (s.y)};
	}
	
	p.setScrollX = function(x) {
		this.setScroll(x, this.getScrollY());
	}
	
	p.setScrollY = function(y) {
		this.setScroll(this.getScrollX(), y);
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
	
	
	p.scroll = function(x, y) {
		if (typeof y === "undefined") {
			y = x.y;
			x = x.x;
		}
		this.setScroll(this.getScrollX() + x, this.getScrollY() + y);
	}
	
	p.scrollX = function(x) {
		this.scroll(x, 0);
	}
	
	p.scrollY = function(y) {
		this.scroll(0, y);
	}
	
	p.draw = function(context) {
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
		var sc = this.getScroll();
		// context.drawImage(this._image, c.x, c.y, s.x, s.y, position.x, position.y, s.x, s.y);
		
		var drawFirst = true;
		var drawSecond = false;
		
		if (drawFirst)
		context.drawImage(
			this._image, 
			c.x + sc.x, 
			c.y + sc.y, 
			this._image.width + c.x, 
			this._image.height + c.y, 
			// s.x,s.y,
			position.x, 
			position.y, 
			s.x - sc.x, 
			s.y - sc.y);
		
		if (drawSecond)
		context.drawImage(
			this._image,
			c.x + s.x + sc.x,
			c.y + s.y + sc.y,
			this._image.width + c.x, 
			this._image.height + c.y,
			position.x - s.x,
			position.y - s.y,
			sc.x,
			sc.y);
		
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