this.CAL = this.CAL || {};

this.CAL.graphics = this.CAL.graphics || {};

(function(undefined) {
	"use strict";
	
	var FontStyles = {
		BOLD: "Bold",
		ITALIC: "Italic"
	}
	
	var getFont = function(baseName, size, props) {
		if (!CAL.lang.isArray(props)) {
			props = typeof props === "undefined" ? [] : [props];
		}
		var rv = "";
		for (var i = 0; i < props.length; ++i) {
			rv += props[i] + " ";
		}
		rv += size.toString() + "px " + baseName;
		return rv;
	}
	
	CAL.graphics.FontStyles = FontStyles;
	CAL.graphics.getFont = getFont;
	
})();