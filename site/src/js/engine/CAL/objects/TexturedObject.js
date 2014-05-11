this.CAL = this.CAL || {};

this.CAL.objects = this.CAL.objects || {};

(function(undefined) {
	"use strict";
	
	var TexturedObject = function(_texture) {
		TexturedObject.super[0].call(this);
		this.setTexture(_texture);
	}
	
	CAL.lang.extend(TexturedObject, CAL.objects.GameObject);
	
	var p = TexturedObject.prototype;
	var s = TexturedObject;
	
	p.getTexture = function() {
		return this._texture;
	}
	
	p.setTexture = function(texture) {
		this._texture = texture;
	}
	
	p.setLocation = function(x, y) {
		s.super[0].prototype.setLocation.call(this, x, y);
		var t = this.getTexture();
		if (t) {
			t.setLocation(x, y);
		}
	}
	
	p.setX = function(x) {
		s.super[0].prototype.setX.call(this, x);
		var t = this.getTexture();
		if (t) {
			t.setX(x);
		}
	}
	
	p.setY = function(y) {
		s.super[0].prototype.setY.call(this, y);
		var t = this.getTexture();
		if (t) {
			t.setY(y);
		}
	}
	
	p.setSize = function(w, h) {
		s.super[0].prototype.setSize.call(this, w, h);
		var t = this.getTexture();
		if (t) {
			t.setSize(w, h);
		}
	}
	
	p.setWidth = function(w) {
		s.super[0].prototype.setWidth.call(this, w);
		var t = this.getTexture();
		if (t) {
			t.setWidth(w);
		}
	}
	
	p.setHeight = function(h) {
		s.super[0].prototype.setHeight.call(this, h);
		var t = this.getTexture();
		if (t) {
			t.setHeight(h);
		}
	}
	
	p.draw = function(params) {
		s.super[0].prototype.draw.call(this, params);
		var t = this.getTexture();
		if (t) {
			t.draw(params.canvas.getContext("2d"));
		}
	}
	
	p.clone = function(object) {
		var rv = object || new TexturedObject(this.getTexture());
		s.super[0].prototype.clone.call(this, rv);
		return rv;
	}
	
	CAL.objects.TexturedObject = TexturedObject;
	
})();