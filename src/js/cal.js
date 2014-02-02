
var CAL = CAL || {};

CAL.Lang = CAL.Lang || {};

CAL.Lang.hashCodeOf = function(obj) {
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

CAL.Lang.format = function(str) {
	var args = arguments;
	return str.replace(/%(\d+)/g,
		function(match, i) {
    	return i < args.length ? args[i] : i;
  	});
}

CAL.Lang.isArray = function(obj) {
	return Object.prototype.toString.call(obj) === "[object Array]";
}




if (!Object.prototype.hashCode) {
	Object.prototype.hashCode = function() {
		return CAL.Lang.hashCodeOf(this);
	}
}




CAL.Graphics = (function() {

	/**
	 * Represents a 2D vector with X and Y components.
	 *
	 * @constructor
	 * @struct
	 */
	Vector2 = function Vector2(x, y) {
		this._x = x;
		this._y = y;
	}
	
	/**
	 * Returns the X-component of this vector.
	 *
	 * @return X component
	 */
	Vector2.prototype.X = function() {
		return this._x;
	}
	
	/**
	 * Returns the Y-component of this vector.
	 *
	 * @return Y component
	 */
	Vector2.prototype.Y = function() {
		return this._y;
	}
	
	Vector2.prototype.add = function(other) {
		return new Vector2(this.X() + other.X(), this.Y() + other.Y());
	}
	
	Vector2.prototype.subtract = function(other) {
		return new Vector2(this.X() - other.X(), this.Y() - other.Y());
	}
	
	Vector2.prototype.multiply = function(other) {
		return new Vector2(this.X() * other.X(), this.Y() * other.Y());
	}
	
	Vector2.prototype.divide = function(other) {
		return new Vector2(this.X() / other.X(), this.Y() / other.Y()); 
	}
	
	Vector2.prototype.scale = function(xTimes, yTimes) {
		return new Vector2(this.X() * xTimes, this.Y() * yTimes); 
	}
	
	Vector2.prototype.translate = function(xAmount, yAmount) {
		return new Vector2(this.X() + xAmount, this.Y() + yAmount);
	}
	
	Vector2.prototype.negate = function() {
		return new Vector2(-this.X(), -this.Y());
	}
	
	Vector2.prototype.equals = function(other) {
		return this.X() === other.X() && this.Y() === other.Y();
	}
	
	/**
	 * Returns a canonical representation of this vector.
	 * 
	 * @return vector as a string
	 */
	Vector2.prototype.toString = function() {
		return CAL.Lang.format("[Vector2] X: %1, Y: %2", this.X(), this.Y());
	}
	
	
	
	
	Shape = function Shape() {
		this._location = new Vector2(0, 0);
		this._size = new Vector2(0, 0);
		this._name = "Shape"
	}
	
	Shape.prototype.getLocation = function() {
		return this._location;
	}
	
	Shape.prototype.getSize = function() {
		return this._size;
	}
	
	Shape.prototype.getCenter = function() {
		var loc = this.getLocation();
		var size = this.getSize();
		return new Vector2(loc.X() + size.X() / 2, loc.Y() + size.Y() / 2);
	}
	
	Shape.prototype.getName = function() {
		return this._name;
	}
	
	Shape.prototype.toString = function() {
		return CAL.Lang.format("[%1]: Location: {%2}, Size: {%3}", this.getName(), this.getLocation(), this.getSize());
	}
	
	Shape.prototype.stroke = function(context) {
	}
	
	Shape.prototype.fill = function(context) {
	}
	
	
	
	
	function RectangleShape(x, y, w, h) {
		this._location = new Vector2(x, y);
		this._size = new Vector2(w, h);
		this._name = "Rectangle";
	}
	
	RectangleShape.prototype = new Shape();
	
	RectangleShape.prototype.stroke = function(context) {
		var loc = this.getLocation();
		var size = this.getSize();
		context.strokeRect(loc.X(), loc.Y(), size.X(), size.Y());
	}
	
	RectangleShape.prototype.fill = function(context) {
		var loc = this.getLocation();
		var size = this.getSize();
		context.fillRect(loc.X(), loc.Y(), size.X(), size.Y());
	}
	
	
	
	
	function CircleShape(cX, cY, r) {
		this._location = new Vector2(cX - r, cY - r);
		this._size = new Vector2(r * 2, r * 2);
		this._name = "Circle";
	}
	
	CircleShape.prototype = new Shape();
	
	CircleShape.prototype.getRadius = function() {
		return this.getSize().X() / 2;
	}
	
	CircleShape.prototype.stroke = function(context) {
		var center = this.getCenter();
		context.moveTo(center.X(), center.Y());
		context.beginPath();
		context.arc(center.X(), center.Y(), this.getRadius(), 0, 2 * Math.PI);
		context.closePath();
		context.stroke();
	}
	
	CircleShape.prototype.fill = function(context) {
		var center = this.getCenter();
		context.moveTo(center.X(), center.Y());
		context.beginPath();
		context.arc(center.X(), center.Y(), this.getRadius(), 0, 2 * Math.PI);
		context.closePath();
		context.fill();
	}
	
	
	
	
	function ArcShape(cX, cY, r, startAngleRad, endAngleRad) {
		this._location = new Vector2(cX - r, cY - r);
		this._size = new Vector2(r * 2, r * 2);
		this._startAngle = startAngleRad;
		this._endAngle = endAngleRad;
		this._name = "Arc";
	}
	
	ArcShape.prototype = new Shape();
	
	ArcShape.prototype.getRadius = function() {
		return this.getSize().X() / 2;
	}
	
	ArcShape.prototype.getStartAngle = function() {
		return this._startAngle;
	}
	
	ArcShape.prototype.getEndAngle = function() {
		return this._endAngle;
	}
	
	ArcShape.prototype.stroke = function(context) {
		var center = this.getCenter();
		context.moveTo(center.X(), center.Y());
		context.beginPath();
		context.arc(center.X(), center.Y(), this.getRadius(), this.getStartAngle(), this.getEndAngle());
		context.stroke();
	}
	
	ArcShape.prototype.fill = function(context) {
		var center = this.getCenter();
		context.moveTo(center.X(), center.Y());
		context.beginPath();
		context.arc(center.X(), center.Y(), this.getRadius(), this.getStartAngle(), this.getEndAngle());
		context.fill();
	}
	
	
	
	
	function ClosedArcShape(cX, cY, r, startAngleRad, endAngleRad) {
		this._location = new Vector2(cX - r, cY - r);
		this._size = new Vector2(r * 2, r * 2);
		this._startAngle = startAngleRad;
		this._endAngle = endAngleRad;
		this._name = "Closed Arc";
	}
	
	ClosedArcShape.prototype = new ArcShape();
	
	ClosedArcShape.prototype.stroke = function(context) {
		var center = this.getCenter();
		context.moveTo(center.X(), center.Y());
		context.beginPath();
		context.arc(center.X(), center.Y(), this.getRadius(), this.getStartAngle(), this.getEndAngle());
		context.closePath();
		context.stroke();
	}
	
	ClosedArcShape.prototype.fill = function(context) {
		var center = this.getCenter();
		context.moveTo(center.X(), center.Y());
		context.beginPath();
		context.arc(center.X(), center.Y(), this.getRadius(), this.getStartAngle(), this.getEndAngle());
		context.closePath();
		context.fill();
	}
	
	
	
	
	function SectorShape(cX, cY, r, startAngleRad, endAngleRad) {
		this._location = new Vector2(cX - r, cY - r);
		this._size = new Vector2(r * 2, r * 2);
		this._startAngle = startAngleRad;
		this._endAngle = endAngleRad;
		this._name = "Sector";
	}
	
	SectorShape.prototype = new Shape();
	
	SectorShape.prototype.getRadius = function() {
		return this.getSize().X() / 2;
	}
	
	SectorShape.prototype.getStartAngle = function() {
		return this._startAngle;
	}
	
	SectorShape.prototype.getEndAngle = function() {
		return this._endAngle;
	}
	
	SectorShape.prototype.stroke = function(context) {
		var center = this.getCenter();
		var startAngle = this.getStartAngle();
		var endAngle = this.getEndAngle();
		var r = this.getRadius();
		context.moveTo(center.X(), center.Y());
		context.beginPath();
		context.arc(center.X(), center.Y(), r, startAngle, endAngle);
		context.lineTo(center.X(), center.Y());
		context.closePath();
		context.stroke();
	}
	
	SectorShape.prototype.fill = function(context) {
		var center = this.getCenter();
		var startAngle = this.getStartAngle();
		var endAngle = this.getEndAngle();
		var r = this.getRadius();
		context.moveTo(center.X(), center.Y());
		context.beginPath();
		context.arc(center.X(), center.Y(), r, startAngle, endAngle);
		context.lineTo(center.X(), center.Y());
		context.closePath();
		context.fill();
	}
	
	
	var FontStyles = {
		BOLD: "Bold",
		ITALIC: "Italic"
	}
	
	function getFont(baseName, size, props) {
		if (!CAL.Lang.isArray(props)) {
			props = typeof props === "undefined" ? [] : [props];
		}
		var rv = size.toString() + "px " + baseName + " ";
		for (var i = 0; i < props.length; ++i) {
			rv += props[i];
		}
		return rv;
	}
	
	Colors = {
		ALICE_BLUE: "AliceBlue",
		ANTIQUE_WHITE: "AntiqueWhite",
		AQUA: "Aqua",
		AQUAMARINE: "Aquamarine",
		AZURE: "Azure",
		BEIGE: "Beige",
		BISQUE: "Bisque",
		BLACK: "BLACK",
		BLANCHED_ALMOND: "BlanchedAlmond",
		BLUE: "Blue",
		BLUE_VIOLET: "BlueViolet",
		BROWN: "Brown",
		BURLY_WOOD: "BurleyWood",
		CADET_BLUE: "CadetBlue",
		CHARTREUSE: "Chartreuse",
		CHOCOLATE: "Chocolate",
		CORAL: "Coral",
		CORNFLOWER_BLUE: "CornflowerBlue",
		CORNSILK: "Consilk",
		CRIMSON: "Crimson",
		CYAN: "Cyan",
		DARK_BLUE: "DarkBlue",
		DARK_CYAN: "DarkCyan",
		DARK_GOLDEN_ROD: "DarkGoldenRod",
		DARK_KHAKI: "DarkKhaki",
		DARK_MAGENTA: "DarkMagenta",
		DARK_OLIVE_GREEN: "DarkOliveGreen",
		DARK_ORANGE: "DarkOrange",
		DARK_ORCHID: "DarkOrchid",
		DARK_RED: "DarkRed",
		DARK_SALMON: "DarkSalmon",
		DARK_SEA_GREEN: "DarkSeaGreen",
		DARK_SLATE_BLUE: "DarkSlateBlue",
		DARK_SLATE_GRAY: "DarkTurquoise",
		DARK_TURQUOISE: "DarkTurquoise",
		DARK_VIOLET: "DarkViolet",
		DEEP_PINK: "DeepPink",
		DEEP_SKY_BLUE: "DeepSkyBlue",
		DIM_GRAY: "DimGray",
		DODGER_BLUE: "DodgerBlue",
		FIRE_BRICK: "FireBrick",
		FLORAL_WHITE: "FloralWhite",
		FOREST_GREEN: "ForestGreen",
		FUSHCIA: "Fushcia",
		GAINSBORO: "Gainsboro",
		GHOST_WHITE: "GhostWhite",
		GOLD: "Gold",
		GOLDEN_ROD: "GoldenRod",
		GRAY: "Gray",
		GREEN: "Green",
		GREEN_YELLOW: "GreenYellow",
		HONEY_DEW: "HoneyDew",
		HOT_PINK: "HotPink",
		INDIAN_RED: "IndianRed",
		INDIGO: "Indigo",
		IVORY: "Ivory",
		KHAKI: "Khaki",
		LAVENDER: "Lavender",
		LAVENDER_BLUSH: "LavenderBlush",
		LAWN_GREEN: "LawnGreen",
		LEMON_CHIFFON: "LemonChiffon",
		LIGHT_BLUE: "LightBlue",
		LIGHT_CORAL: "LightCoral",
		LIGHT_CYAN: "LightCyan",
		LIGHT_GOLDEN_ROD_YELLOW: "LightGoldenRodYellow",
		LIGHT_GRAY: "LightGray",
		LIGHT_GREEN: "LightGreen",
		LIGHT_PINK: "LightPink",
		LIGHT_SALMON: "LightSalmon",
		LIGHT_SEA_GREEN: "LightSeaGreen",
		LIGHT_SKY_BLUE: "LightSkyBlue",
		LIGHT_SLATE_GRAY: "LightSlateGray",
		LIGHT_STEEL_BLUE: "LightSteelBlue",
		LIGHT_YELLOW: "LightYellow",
		LIME: "Lime",
		LIME_GREEN: "LimeGreen",
		LINEN: "Linen",
		MAGENTA: "Magenta",
		MAROON: "Maroon",
		MEDIUM_AQUAMARINE: "MediumAquamarine",
		MEDIUM_BLUE: "MediumBlue",
		MEDIUM_ORCHID: "MediumOrchid",
		MEDIUM_PURPLE: "MediumPurple",
		MEDIUM_SEA_GREEN: "MediumSeaGreen",
		MEDIUM_SLATE_BLUE: "MediumSlateBlue",
		MEDIUM_SPRING_GREEN: "MediumSpringGreen",
		MEDIUM_TURQUOISE: "MediumTurquoise",
		MEDIUM_VIOLET: "MediumViolet",
		MIDNIGHT_BLUE: "MidnightBlue",
		MINT_CREAM: "MintCream",
		MISTY_ROSE: "MistyRose",
		MOCCASIN: "Moccasin",
		NAVAJO_WHITE: "NavajoWhite",
		NAVY: "Navy",
		OLD_LACE: "OldLace",
		OLIVE: "Olive",
		OLIVE_DRAB: "OliveDrab",
		ORANGE: "Orange",
		ORANGE_RED: "OrangeRed",
		ORCHID: "Orchid",
		PALE_GOLDEN_ROD: "PaleGoldenRod",
		PALE_GREEN: "PaleGreen",
		PALE_TURQUOISE: "PaleTurquoise",
		PALE_VIOLET_RED: "PaleVioletRed",
		PAPAYA_WHIP: "PapayaWhip",
		PEACH_PUFF: "PeachPuff",
		PERU: "Peru",
		PINK: "Pink",
		PLUM: "Plum",
		POWDER_BLUE: "PowderBlue",
		PURPLE: "Purple",
		RED: "Red",
		ROSY_BROWN: "RosyBrown",
		ROYAL_BLUE: "RoyalBlue",
		SADDLE_BROWN: "SaddleBrown",
		SALMON: "Salmon",
		SANDY_BROWN: "SandyBrown",
		SEA_GREEN: "SeaGreen",
		SEA_SHELL: "SeaShell",
		SIENNA: "Sienna",
		SILVER: "Silver",
		SKY_BLUE: "SkyBlue",
		SLATE_BLUE: "SlateBlue",
		SLATE_GRAY: "SlateGray",
		SNOW: "Snow",
		SPRING_GREEN: "SpringGreen",
		STEEL_BLUE: "SteelBlue",
		TAN: "Tan",
		TEAL: "Teal",
		THISTLE: "Thistle",
		TOMATO: "Tomato",
		TURQUOISE: "Turquoise",
		VIOLET: "Violet",
		WHEAT: "Wheat",
		WHITE: "White",
		WHITE_SMOKE: "WhiteSmoke",
		YELLOW: "Yellow",
		YELLOW_GREEN: "YellowGreen",
		
		getRGB: function(r, g, b) {
			return "rgb(" + r.toString() + "," + g.toString() + "," + b.toString() + ")";
		},
		
		isKnownColor: function(name) {
			for (var obj in this) {
				if ((typeof obj === "string") && obj.toLowerCase() == name.toLowerCase()) {
					return true;
				}
			}
			return false;
		},
		
	}
	
	
	
	return {
		Vector2: Vector2,
		Shape: Shape,
		RectangleShape: RectangleShape,
		CircleShape: CircleShape,
		ArcShape: ArcShape,
		ClosedArcShape: ClosedArcShape,
		SectorShape: SectorShape,
		
		FontStyles: FontStyles,
		getFont: getFont,
		Colors: Colors
		
	};

})();