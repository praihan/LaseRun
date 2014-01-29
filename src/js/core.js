
function Core() {}
	
Core.hashCodeOf = function(obj) {
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

Core.str_format = function(str) {
	var args = arguments;
	return str.replace(/%(\d+)/g,
		function(match, i) {
    	return i < args.length ? args[i] : i;
  	});
}




if (!Object.prototype.hashCode) {
	Object.prototype.hashCode = function() {
		return Core.hashCodeOf(this);
	}
}