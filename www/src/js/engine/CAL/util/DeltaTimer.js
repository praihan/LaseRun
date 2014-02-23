this.CAL = this.CAL || {};

this.CAL.Util = this.CAL.Util || {};

(function(undefined) {
	"use strict";
	
	var DeltaTimer = function(msInterval, currentTime) {
		this._msInterval = msInterval;
		this._currentTime = currentTime || 0;
		this._resetValue = 0;
		this._callbacks = new Array();
	}
	
	var p = DeltaTimer.prototype;
	
	p.postCallback = function(callback, scope) {
		var cs = this._callbacks;
		if (!scope) {
			cs[cs.length] = {
				callback: callback.callback, 
				scope: callback.scope || callback.callback || this
			};
		} else {
			cs[cs.length] = {
				callback: callback, 
				scope: scope || callback || this
			};
		}
		return this;
	}
	
	p.update = function(delta) {
		this._currentTime += delta;
		if (this._currentTime >= this._msInterval) {
			this._currentTime = this._resetValue;
			for (var i = 0; i < this._callbacks.length; ++i) {
				var c = this._callbacks[i];
				c.callback.call(c.scope);
			}
		}
	}
	
	p.clear = function() {
		this._callbacks.length = 0;
	}
	
	CAL.Util.DeltaTimer = DeltaTimer;
	
})();