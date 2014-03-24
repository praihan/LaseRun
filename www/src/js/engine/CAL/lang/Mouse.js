this.CAL = this.CAL || {};

this.CAL.lang = this.CAL.lang || {};

(function(undefined) {
	"use strict";
	
	var buttonCodeToName = {1:"Left",2:"Middle",3:"Right"};
	var buttonNameToCode = {"Left":1,"Middle":2,"Right":3};
	
	var Mouse = function(element) {
		
		var down = this._down = {};
		
		this._listeners = {};
		this._globalListeners = [];	
		
		this._pressListeners = {};
		this._globalPressListeners = [];
		
		var globalCallback = function(mouse, evt) {
			for (var i = 0; i < mouse._globalListeners.length; ++i) {
				var c = mouse._globalListeners[i];
				c.callback.call(c.scope, evt);
			}
		}
		
		var pressCallback = function(keyboard, evt) {
			var arr = keyboard._pressListeners[evt.which];
			if (arr) {
				for (var i = 0; i < arr.length; ++i) {
					var c = arr[i];
					c.callback.call(c.scope, evt);
				}
			}
		}
		
		var globalPressCallback = function(mouse, evt) {
			for (var i = 0; i < mouse._globalPressListeners.length; ++i) {
				var c = mouse._globalPressListeners[i];
				c.callback.call(c.scope, evt);
			}
		}
		
		var _this = this;
		
		var mousedownListener = function(evt) {
			down[evt.which] = true;
			globalCallback(_this, evt);
		}
		
		var mouseupListener = function(evt) {
			if (typeof down[evt.which] === "undefined") {
				return;
			}
			delete down[evt.which];
			globalCallback(_this, evt);
			pressCallback(_this, evt);
			globalPressCallback(_this, evt);
		}
		
		element.addEventListener("mousedown", mousedownListener);
		element.addEventListener("mouseup", mouseupListener);
	}
	
	var p = Mouse.prototype = new CAL.lang.IUpdateableObject();
	
	var s = Mouse;
	
	p.pause = function() {
		this._paused = true;
	}
	
	p.resume = function() {
		delete this._paused;
	}
	
	p.addEventListener = function(buttonCode, callback, scope) {
		var toPush = {callback: callback, scope: scope || callback};
		if (buttonCode === -1) {
			this._globalListeners.push(toPush);
			return;
		}
		var listeners = this._listeners;
		if (!listeners[buttonCode]) {
			listeners[buttonCode] = [toPush];
		} else {
			listeners[buttonCode].push(toPush);
		}
	}
	
	p.addPressListener = function(buttonCode, callback, scope) {
		var toPush = {callback: callback, scope: scope || callback};
		if (buttonCode === -1) {
			this._globalPressListeners.push(toPush);
			return;
		}
		var pressListeners = this._pressListeners;
		if (!pressListeners[buttonCode]) {
			pressListeners[buttonCode] = [toPush];
		} else {
			pressListeners[buttonCode].push(toPush);
		}
	}
	
	p.removeEventListener = function(buttonCode, callbackObj) {
		if (buttonCode === -1) {
			var l = this._globalListeners;
			for (var i = 0; i < l.length; ++i) {
				if (callbackObj === l[i]) {
					delete this._globalListeners[i];
				}
			}
		}
		var listeners = this._listeners;
		var arr = listeners[buttonCode];
		if (!arr) {
			return;
		}
		for (var i = 0; i < arr.length; ++i) {
			if (arr[i] === callbackObj) {
				delete arr[i];
				if (arr.length = 0) {
					delete this._listeners[buttonCode];
				}
				return;
			}
		}
	}
	
	p.removePressListener = function(buttonCode, callbackObj) {
		if (buttonCode === -1) {
			var l = this._globalPressListeners;
			for (var i = 0; i < l.length; ++i) {
				if (callbackObj === l[i]) {
					delete this._globalPressListeners[i];
				}
			}
		}
		var listeners = this._pressListeners;
		var arr = listeners[buttonCode];
		if (!arr) {
			return;
		}
		for (var i = 0; i < arr.length; ++i) {
			if (arr[i] === callbackObj) {
				delete arr[i];
				if (arr.length = 0) {
					delete this._pressListeners[buttonCode];
				}
				return;
			}
		}
	}
	
	p.update = function(params) {
		if (this._paused) {
			return;
		}
		var listeners = this._listeners;
		var down = this._down;
		for (var buttonCode in down) {
			var arr = listeners[buttonCode];
			if (!arr) {
				continue;
			}
			for (var i = 0; i < arr.length; ++i) {
				var c = arr[i];
				c.callback.call(c.scope, buttonCode);
			}
		}
	}
	
	p.isDown = function(buttonCodeOrName) {
		if (!(typeof buttonCodeOrName === "number")) {
			buttonCodeOrName = buttonNameToCode[buttonCodeOrName.trim()];
		}
		return typeof buttonCodeOrName === "undefined" ? false : (this._down[buttonCodeOrName] ? true : false);
	}
	
	
	
	
	p.getButtonName = s.getButtonName = function(buttonCode) {
		return buttonCodeToName[buttonCode];
	}
			
	p.getButtonCode = s.getButtonCode = function(name) {
		return buttonNameToCode[name.trim()];
	}
	
	
	
	
	CAL.lang.Mouse = Mouse;
	
})();