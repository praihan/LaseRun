this.CAL = this.CAL || {};

this.CAL.Graphics = (function() {	
	
	/**
	 * Represents an abstract shape
	 *
	 * @constructor
	 */
	Shape = function Shape() {
		this._location = new Vector2(0, 0);
		this._size = new Vector2(0, 0);
		this._name = "Shape"
	}
	
	/**
	 * Returns the X and Y location of this shape.
	 * 
	 * @return the location of this shape
	 */
	Shape.prototype.getLocation = function() {
		return this._location;
	}
	
	/**
	 * Returns the width and height of this shape.
	 * 
	 * @return the size of this shape
	 */
	Shape.prototype.getSize = function() {
		return this._size;
	}
	
	/**
	 * Returns the logical center of this shape as a vector.
	 * 
	 * @return the center of this shape
	 */
	Shape.prototype.getCenter = function() {
		var loc = this.getLocation();
		var size = this.getSize();
		return new Vector2(loc.X() + size.X() / 2, loc.Y() + size.Y() / 2);
	}
	
	/**
	 * Returns the canonical name of this shape.
	 * 
	 * @return the name of this shape
	 */
	Shape.prototype.getName = function() {
		return this._name;
	}
	
	/**
	 * Returns a canonical representation of this shape.
	 * 
	 * @return this shape as a string
	 */
	Shape.prototype.toString = function() {
		return CAL.Lang.format("[%1]: Location: {%2}, Size: {%3}", this.getName(), this.getLocation(), this.getSize());
	}
	
	/**
	 * Strokes the shape on a context
	 * 
	 * @param context a drawing context, like a 2D canvas context
	 */
	Shape.prototype.stroke = function(context) {
	}
	
	/**
	 * Fills the shape on a context
	 * 
	 * @param context a drawing context, like a 2D canvas context
	 */
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
		var rv = "";
		for (var i = 0; i < props.length; ++i) {
			rv += props[i] + " ";
		}
		rv += size.toString() + "px " + baseName;
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
		Colors: Colors,	
	};

})();