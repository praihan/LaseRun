function Shape() {
	this._x = 0;
	this._y = 0;
	this._width = 0;
	this._height = 0;	
	this._name = "Shape"
}

Shape.prototype.getX = function() {
	return this._x;
}

Shape.prototype.getY = function() {
	return this._y;
}

Shape.prototype.getWidth = function() {
	return this._width;
}

Shape.prototype.getHeight = function() {
	return this._height;
}

Shape.prototype.getName = function() {
	return this._name;
}

Shape.prototype.toString = function() {
	return Core.str_format("[%1]: X: %2, Y: %3, Width: %4, Height: %5", this.getName(), this.getX(), this.getY(), this.getWidth(), this.getHeight());
}




function Rectangle(x, y, w, h) {
	this._x = x;
	this._y = y;
	this._width = w;
	this._height = h;
	this._name = "Rectangle";
}

Rectangle.prototype = new Shape();