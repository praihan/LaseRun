this.CAL = this.CAL || {};

this.CAL.graphics = this.CAL.graphics || {};

(function(undefined) {
	"use strict";
	
	var TWO_PI = Math.PI * 2;
	
	var ParallaxSprite = function(params) {
		ParallaxSprite.super.call(this, params);
		this.setScroll(0, 0);
	}
	
	CAL.lang.extend(ParallaxSprite, CAL.graphics.Sprite);
	
	var p = ParallaxSprite.prototype;
	
	p.clone = function() {
		return new ParallaxSprite(this);
	}
	
	p.setScroll = function(x, y) {
		if (typeof y === "undefined") {
			y = x.y;
			x = x.x;
		}
		var c = this.getClipping();
		// this._scroll = {x: x % (s.x - c.x), y: y % (s.y - c.y)};
		// this._scroll = {x: x % (s.x - c.x), y: y % (s.y - c.y)};
		this._scroll = {x: x % (this._image.width - c.x), y: y % (this._image.height - c.y)};
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
		var f = this.getFlip();
		
		var position = {
			x: l.x,
			y: l.y
		}
				
		var img = this._image;
		
		context.scale(f.x ? -1 : 1, f.y ? -1 : 1);
		
		var sc = this.getScroll();
		
		
		var ratioX, ratioY;
		ratioX = (parseFloat(s.x) / parseFloat(img.width));
		ratioY = (parseFloat(s.y) / parseFloat(img.height));
		
		context.drawImage(
			img, 
			c.x + sc.x, 
			c.y + sc.y, 
			img.width + c.x, 
			img.height + c.y, 
			position.x, 
			position.y, 
			s.x + c.x,
			s.y + c.y
			// ratioX * (s.x + c.x), 
			// ratioY * (s.y + c.y)
			);
		console.log(ratioX);
		
		var scx = parseInt(sc.x) ? true : false;
		var scy = parseInt(sc.y) ? true : false;
		
		if (!scx && !scy) return;	
		
		context.drawImage(
			this._image,
			c.x, 
			c.y, 
			scx ? sc.x : img.width + c.x, 
			scy ? sc.y : img.height + c.y, 
			scx ? (position.x + s.x - ratioX * (sc.x)) : position.x, 
			scy ? (position.y + s.y - ratioY * (sc.y)) : position.y, 
			scx ? (ratioX) * (sc.x) : s.x,
			scy ? ratioY * (sc.y) : s.y);
		
		context.restore();
	}
	
	CAL.graphics.ParallaxSprite = ParallaxSprite;
	
})();