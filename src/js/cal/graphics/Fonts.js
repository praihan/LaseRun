this.CAL = this.CAL || {};

this.CAL.Graphics = this.CAL.Graphics || {};

(function() {
	"use strict";
	
	var FontStyles = {
		BOLD: "Bold",
		ITALIC: "Italic"
	}
	
	var getFont = function(baseName, size, props) {
		if (!CAL.Lang.isArray(props)) {
			props = typeof props === "undefined" ? [] : [props];
		}
		var rv = "";
		for (var i = 0; i < props.length; ++i) {
			rv += props[i] + " ";
		}
		rv += size.toString() + "px " + baseName;
		return rv;
	}
	
	CAL.Graphics.FontStyles = FontStyles;
	CAL.Graphics.getFont = getFont;
	
})();