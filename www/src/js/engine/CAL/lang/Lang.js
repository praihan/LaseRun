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
	
	lang.extend = function(child, parent) {
		for (var i in parent) {
			if (!child[i]) {
				child[i] = parent[i];
			}
		}
	}
		
	CAL.lang = lang;
	
})();