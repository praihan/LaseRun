this.CAL = this.CAL || {};

this.CAL.Graphics = this.CAL.Graphics || {};

(function(undefined) {
	"use strict";
	
	var DisplayObject = function() {
		this._location = CAL.Graphics.Vector2(0, 0);
		this._size = CAL.Graphics.Vector2(0, 0);
	}
	
	var p = DisplayObject.prototype = new CAL.Lang.IUpdateableObject();
	
	p.getAttributes = function() {
		return  {
			location: this.getLocation(),
			size: this.getSize()
		};
	}
	
	p.getLocation = function() {
		return this._location;
	}
	
	p.getX = function() {
		return this._location.x;
	}
	
	p.getY = function() {
		return this._location.y;
	}
	
	p.setLocation = function(x, y) {
		if (typeof y === "undefined") {
			this._location = CAL.Graphics.Vector2(x.x, x.y);
			return;
		}
		this._location = CAL.Graphics.Vector2(x, y);
	}
	
	p.setX = function(x) {
		this._location.x = x;
	}
	
	p.setY = function(x) {
		this._location.y = y;
	}
	
	p.getSize = function() {
		return this._size;
	}
	
	p.getWidth = function() {
		return this._size.x;
	}
	
	p.getHeight = function() {
		return this._size.y;
	}
	
	p.setSize = function(w, h) {
		if (typeof h === "undefined") {
			this._size = CAL.Graphics.Vector2(w.x || w.width, w.y || w.height);
			return;
		}
		this._size = CAL.Graphics.Vector2(w, h);
	}
	
	p.setWidth = function(w) {
		this._size.x = w;
	}
	
	p.setHeight = function(h) {
		this._size.y = h;
	}
	
	p.draw = function(params) {
	}
	
	CAL.Graphics.DisplayObject = DisplayObject;
	
})();