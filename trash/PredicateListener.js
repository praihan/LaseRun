this.CAL = this.CAL || {};

this.CAL.util = this.CAL.util || {};

(function(undefined) {
	"use strict";
	
	var PredicateListener = function(predicateCallback) {
		this._callbacks = new Array();
		this._predicateCallback = predicateCallback || function() { return false; };
	}
	
	var p = PredicateListener.prototype = new CAL.lang.IUpdateableObject();
	
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
	
	p.update = function(params) {
		if (this._predicateCallback()) {
			for (var i = 0; i < this._callbacks.length; ++i) {
				var c = this._callbacks[i];
				c.callback.call(c.scope);
			}
		}
	}
	
	CAL.util.PredicateListener = PredicateListener;
	
})();