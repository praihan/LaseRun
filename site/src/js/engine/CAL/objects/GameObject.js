this.CAL = this.CAL || {};

this.CAL.objects = this.CAL.objects || {};

(function(undefined) {
	"use strict";
	
	var GameObject = function() {
		GameObject.super[0].call(this);
		GameObject.super[1].call(this);
		this._updateListeners = [];
		this._drawListeners = [];
	}
	
	CAL.lang.extend(GameObject, [CAL.graphics.DisplayObject, CAL.lang.IUpdateableObject]);
	
	var p = GameObject.prototype;
	var s = GameObject;
	
	p.on = function(eventName, callback, scope) {
		if (!callback) {
			return;
		}
		switch (eventName.toLowerCase()) {
			case "update":
				this._updateListeners.push({callback: callback, scope: scope || callback});
				break;
			case "draw":
				this._drawListeners.push({callback: callback, scope: scope || callback});
		}
	}
	
	p.update = function(params) {
		for (var i = 0; i < this._updateListeners.length; ++i) {
			var e = this._updateListeners[i];
			e.callback.call(e.scope, this, params);
		}
		s.super[0].prototype.update.call(this, params);
	}
	
	p.draw = function(params) {
		for (var i = 0; i < this._drawListeners.length; ++i) {
			var e = this._drawListeners[i];
			e.callback.call(e.scope, this, params);
		}
		s.super[0].prototype.draw.call(this, params);
	}
	
	p.clone = function(object) {
		var rv = object || new GameObject();
		rv._updateListeners = this._updateListeners;
		rv._drawListeners = this._drawListeners;
		return rv;
	}
	
	CAL.objects.GameObject = GameObject;
	
})();