this.CAL = this.CAL || {};

this.CAL.Util = this.CAL.Util || {};

(function() {
	"use strict";
	
	var DeltaTimer = function(msInterval, callback, scope, currentTime) {
		this._msInterval = msInterval;
		this._currentTime = currentTime || 0;
		this._resetValue = 0;
		this._callback = callback;
		this._callbackScope = scope || callback || this;
	}
	
	var p = DeltaTimer.prototype;
	
	p.setCallback = function(callback) {
		this._callback = callback;
	}
	
	p.setInterval = function(msInterval) {
		this._msInterval = msInterval;
	}
	
	p.update = function(delta) {
		this._currentTime += delta;
		if (this._currentTime >= this._msInterval) {
			this._currentTime = this._resetValue;
			this._callback.call(this._callbackScope);
		}
	}
	
	CAL.Util.DeltaTimer = DeltaTimer;
	
})();