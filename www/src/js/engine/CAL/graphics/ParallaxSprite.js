this.CAL = this.CAL || {};

this.CAL.graphics = this.CAL.graphics || {};

(function(undefined) {
	"use strict";
	
	var TWO_PI = Math.PI * 2;
	
	// var drawBase;
	
	var ParallaxSprite = function(params) {
<<<<<<< HEAD
		CAL.lang.extend(this, new CAL.graphics.Sprite(params));
		this.setScroll({x: 0, y: 0});
=======
		var base = new CAL.graphics.Sprite(params);
		// if (!drawBase) {
			// drawBase = base.draw;
		// }
		CAL.lang.extend(this, base);
		this.setScroll(0, 0);
>>>>>>> ad90f318b9eea925efc04bf0290f769d824e0971
	}
	
	var p = ParallaxSprite.prototype;
	
<<<<<<< HEAD
	p.setScroll = function(s) {
		this._scroll = {x: s.x, y: s.y};
	}
	
	p.setScrollX = function(x) {
		this._scroll.x = x;
	}
	
	p.setScrollY = function(y) {
		this._scroll.y = y;
=======
	p.setScroll = function(x, y) {
		if (typeof y === "undefined") {
			y = x.y;
			x = x.x;
		}
		var s = this.getSize();
		this._scroll = {x: x % s.x, y: y % s.y};
	}
	
	p.setScrollX = function(x) {
		this._scroll.x = x % this.getWidth();
	}
	
	p.setScrollY = function(y) {
		this._scroll.y = y % this.getWidth();
>>>>>>> ad90f318b9eea925efc04bf0290f769d824e0971
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
	
<<<<<<< HEAD
	p.draw = function(context) {
		context.save();
=======
	
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
>>>>>>> ad90f318b9eea925efc04bf0290f769d824e0971
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
<<<<<<< HEAD
		// context.drawImage(this._image, c.x, c.y, s.x, s.y, position.x, position.y, s.x, s.y);
		context.drawImage(
			this._image, 
			c.x, 
			c.y, 
=======
		var sc = this.getScroll();
		// context.drawImage(this._image, c.x, c.y, s.x, s.y, position.x, position.y, s.x, s.y);
		context.drawImage(
			this._image, 
			c.x + sc.x, 
			c.y + sc.y, 
>>>>>>> ad90f318b9eea925efc04bf0290f769d824e0971
			this._image.width + c.x, 
			this._image.height + c.y, 
			// s.x,s.y,
			position.x, 
			position.y, 
			s.x, 
			s.y);
<<<<<<< HEAD
=======
		context.drawImage(
			this._image,
			c.x + s.x + sc.x,
		
>>>>>>> ad90f318b9eea925efc04bf0290f769d824e0971
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