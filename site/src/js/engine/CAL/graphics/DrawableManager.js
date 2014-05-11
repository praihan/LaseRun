this.CAL = this.CAL || {};

this.CAL.graphics = this.CAL.graphics || {};

(function(undefined) {
	"use strict";
	
	var DrawableManager = function(drawableManager) {
		this._drawables = CAL.lang.newList();
		this._nameMap = {};
		
		if (typeof drawableManager !== "undefined") {
			var s = drawableManager._drawables;
			var n = drawableManager._nameMap;
			for (var i = 0; i < s.length; ++i) {
				this._drawables[i] = s[i];
			}
			for (var el in n) {
				this._nameMap[el] = n[el];
			}
		}
	}
	
	var p = DrawableManager.prototype;
	
	p.count = p.size = p.length = function() {
		return this._drawables.length;
	}
	
	var addName = function(manager, name, drawable) {
		if (typeof name !== "undefined") {
			if (manager._nameMap[name]) {
				throw CAL.lang.exception("NameTakenException", name);
			}
			manager._nameMap[name] = drawable;
		}
	}
	
	p.pushDrawable = function(drawable, name) {
		this._drawables.push(drawable);
		addName(this, name, drawable);
	}
	
	p.insertDrawable = function(index, drawable, name) {
		if (typeof index == "undefined") {
			this.pushDrawable(drawable, name);
		}
		this._drawables.insertAt(index, drawable);
		addName(this, name, drawable);
	}
	
	p.insertDrawableBefore = function(indexOrPredicate, drawable, name) {
		this._drawables.insertBefore(indexOrPredicate, drawable);
		addName(this, name, drawable);
	}
	
	p.insertDrawableAfter = function(indexOrPredicate, drawable, name) {
		this._drawables.insertAfter(indexOrPredicate, drawable);
		if (typeof name !== "undefined") {
			this._nameMap[name] = drawable;
		}
	}
	
	p.removeDrawable = function(predicateOrIndex, removeOnce) {
		var len = this._drawables.length;
		if (typeof predicateOrIndex === "number") {
			var index = predicateOrIndex;
			this._drawables.splice(index, 1);
		} else {
			if (typeof predicateOrIndex !== "function") {
				CAL.lang.exception("badtype", "Required: Predicate or Index");
			}
			for (var i = 0, len = this._drawables.length; i < len; ++i) {
				var s = this._drawables[i];
				if (predicateOrIndex(s)) {
					this.splice(i, 1);
					for (var n in this._nameMap) {
						if (this._nameMap[n] === s) {
							this._nameMap[n] = null;
							delete this._nameMap[n];
						}
					}
					len--;
					i--;
					if (removeOnce) {
						break;
					}
				}
			}
		}
		return this._drawables.length != len;
	}
	
	p.getDrawable = function(indexOrName) {
		if (typeof indexOrName === "number") {
			return this._drawables[indexOrName];
		}
		return this._nameMap[indexOrName];
	}
	
	p.sort = function(sorter) {
		this._drawables.sort(sorter);
	}
	
	p.draw = function(params) {
		for (var i = 0; i < this._drawables.length; ++i) {
			if (this._drawables[i].draw) {
				this._drawables[i].draw(params);
			}
		}
	}
	
	p.update = function(params) {
		for (var i = 0; i < this._drawables.length; ++i) {
			if (this._drawables[i].update) {
				this._drawables[i].update(params);
			}
		}
	}
	
	p.clone = function() {
		return new DrawableManager(this);
	}
	
	
	
	CAL.graphics.DrawableManager = DrawableManager;
	
})();