this.CAL = this.CAL || {};

this.CAL.Util = this.CAL.Util || {};

(function() {
	
	var DeltaTimer = function(msInterval, callback, callbackContext, currentTime) {
		this._msInterval = msInterval;
		this._currentTime = currentTime || 0;
		this._resetValue = 0;
		this._callback = callback;
		this._callbackContext = callbackContext || null;
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
			if (this._callbackContext == null) {
				this._callback();
			} else {
				this._callback(this._callbackContext);
			}
		}
	}
	
	this.CAL.Util.DeltaTimer = DeltaTimer;
	
})();