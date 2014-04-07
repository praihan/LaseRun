this.CAL = this.CAL || {};

(function(undefined) {
	"use strict";
	
	var lang = function() {
	}
	
	lang.hashCodeOf = function(obj) {
		if (obj === null) {
			return 0;
		}
		if (Array.prototype.reduce){
			return obj.toString().split("").reduce(
				function(a, b) {
					a = ((a << 5) - a) + b.charCodeAt(0);
					return a & a;
				}, 
				0);
		}
		var hash = 0;
		var str = obj.toString();
		if (str.length === 0) {
			return 0;
		}
		for (var i = 0; i < str.length; ++i) {
			var c  = str.charCodeAt(i);
			hash  = ((hash << 5) - hash) + c;
			hash &= hash;
		}
		return hash;
	}
	
	lang.format = function(str) {
		var args = arguments;
		return str.replace(/%(\d+)/g,
			function(match, i) {
			return i < args.length ? args[i] : i;
		});
	}
	
	lang.toCamelCase = function(str) {
		return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
	};

	
	lang.isArray = function(obj) {
		return Object.prototype.toString.call(obj) === "[object Array]";
	}
	
	
	lang._exposed = {};
	
	var List$insertAt = lang._exposed.List$insertAt = function(index, o) {
		if (index > -1 && index <= this.length) {
			this.splice(index, 0, o);
			return true;
		}        
		return false;
	}
	var List$insertBefore = lang._exposed.List$insertBefore = function(predicateOrIndex, o) {
		var index;
		if (typeof predicateOrIndex === "number") {
			index = predicateOrIndex;
		} else {
			if (typeof predicateOrIndex !== "function") {
				CAL.lang.exception("badtype", "Required: Predicate or Index");
			}
			for (var i = 0; i < this.length; ++i) {
				if (predicateOrIndex(this[i], o)) {
					index = i;
					break;
				}
			}
		}
		if (typeof index === "undefined") {
			return false;
		}
		if (index === 0) {
			this.unshift(o);
		} else {
			return this.insertAt(index - 1, o);
		}
		return true;
	}
	var List$insertAfter = lang._exposed.List$insertAfter = function(predicateOrIndex, o) {
		var index;
		if (typeof predicateOrIndex === "number") {
			index = predicateOrIndex;
		} else {
			if (typeof predicateOrIndex !== "function") {
				CAL.lang.exception("badtype", "Required: Predicate or Index");
			}
			for (var i = 0; i < this.length; ++i) {
				if (predicateOrIndex(this[i])) {
					index = i;
					break;
				}
			}
		}
		if (typeof index === "undefined") {
			return false;
		}
		if (index == this.length - 1) {
			this.push(o);
		} else {
			return this.insertAt(index + 1, o);
		}
		return true;
	}
	var List$remove = lang._exposed.List$remove = function(predicateOrIndex, removeOnce) {
		var len = this.length;
		if (typeof predicateOrIndex === "number") {
			var index = predicateOrIndex;
			this.splice(index, 1);
		} else {
			if (typeof predicateOrIndex !== "function") {
				CAL.lang.exception("badtype", "Required: Predicate or Index");
			}
			for (var i = 0, len = this.length; i < len; ++i) {
				if (predicateOrIndex(this[i])) {
					this.splice(i, 1);
					len--;
					i--;
					if (removeOnce) {
						break;
					}
				}
			}
		}
		return this.length != len;
	}
	lang.newList = function() {
		var rv = [];
		
		rv.insertAt = List$insertAt;
		
		rv.insertBefore = List$insertBefore;
		
		rv.insertAfter = List$insertAfter;
		
		rv.remove = List$remove;
		
		return rv;
	}
	
	
	
	
	lang.extend = function(child, parent) {
		for (var i in parent) {
			if (!child[i]) {
				child[i] = parent[i];
			}
		}
	}
	
	
	
	
	var exceptionAliases = {
		"ioob": "IndexOutOfBoundsException",
		"undefined": "UndefinedValueException",
		"badtype": "TypeMismatchException",
		"nosupport": "UnsupportedFeatureException",
		"unknown": "UnknownException",		
	}
	lang.exception = function(type, message, disableAlias) {
		var title = disableAlias ? type : (exceptionAliases[type] || type);
		message = message || "<no_message>";
		return "[" + title + "] " + message;
	}
	
	CAL.lang = lang;
	
})();