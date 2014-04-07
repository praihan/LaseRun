this.CAL = this.CAL || {};

this.CAL.graphics = this.CAL.graphics || {};

(function(undefined) {
	"use strict";
	
	var SpriteManager = function(spriteManager) {
		this._sprites = CAL.lang.newList();
		this._nameMap = {};
		
		if (typeof spriteManager !== "undefined") {
			var s = spriteManager._sprites;
			var n = spriteManager._nameMap;
			for (var i = 0; i < s.length; ++i) {
				this._sprite[i] = s[i];
			}
			for (var el in n) {
				this._nameMap[el] = n[el];
			}
		}
	}
	
	var p = SpriteManager.prototype;
	
	p.count = p.size = p.length = function() {
		return this._sprites.length;
	}
	
	var addName = function(manager, name, sprite) {
		if (typeof name !== "undefined") {
			if (manager._nameMap[name]) {
				throw CAL.lang.exception("NameTakenException", name);
			}
			manager._nameMap[name] = sprite;
		}
	}
	
	p.pushSprite = function(sprite, name) {
		this._sprites.push(sprite);
		addName(this, name, sprite);
	}
	
	p.insertSprite = function(index, sprite, name) {
		if (typeof index == "undefined") {
			this.pushSprite(sprite, name);
		}
		this._sprites.insertAt(index, sprite);
		addName(this, name, sprite);
	}
	
	p.insertSpriteBefore = function(indexOrPredicate, sprite, name) {
		this._sprites.insertBefore(indexOrPredicate, sprite);
		addName(this, name, sprite);
	}
	
	p.insertSpriteAfter = function(indexOrPredicate, sprite, name) {
		this._sprites.insertAfter(indexOrPredicate, sprite);
		if (typeof name !== "undefined") {
			this._nameMap[name] = sprite;
		}
	}
	
	p.removeSprite = function(predicateOrIndex, removeOnce) {
		var len = this._sprites.length;
		if (typeof predicateOrIndex === "number") {
			var index = predicateOrIndex;
			this._sprites.splice(index, 1);
		} else {
			if (typeof predicateOrIndex !== "function") {
				CAL.lang.exception("badtype", "Required: Predicate or Index");
			}
			for (var i = 0, len = this._sprites.length; i < len; ++i) {
				var s = this._sprites[i];
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
		return this._sprites.length != len;
	}
	
	p.getSprite = function(indexOrName) {
		if (typeof indexOrName === "number") {
			return this._sprites[indexOrName];
		}
		return this._nameMap[indexOrName];
	}
	
	p.sort = function(sorter) {
		this._sprites.sort(sorter);
	}
	
	p.draw = function(context) {
		for (var i = 0; i < this._sprites.length; ++i) {
			this._sprites[i].draw(context);
		}
	}
	
	p.clone = function() {
		return new SpriteManager(this);
	}
	
	
	
	
	CAL.graphics.SpriteManager = SpriteManager;
	
})();