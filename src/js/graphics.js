function Vector2(x, y) {
	this._x = x;
	this._y = y;
}

Vector2.prototype.X = function() {
	return this._x;
}

Vector2.prototype.Y = function() {
	return this._y;
}

Vector2.prototype.toString = function() {
	return Core.str_format("[Vector2] X: %1, Y: %2", this.X(), this.Y());
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




function Shape() {
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
	return Core.str_format("[%1]: Location: {%2}, Size: {%3}", this.getName(), this.getLocation(), this.getSize());
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
	var location = this.getLocation();
	var center = this.getCenter();
	context.moveTo(center.X(), center.Y());
	context.beginPath();
	context.arc(center.X(), center.Y(), this.getRadius(), 0, 2 * Math.PI, false);
	context.closePath();
	context.stroke();
}

CircleShape.prototype.fill = function(context) {
	var location = this.getLocation();
	var center = this.getCenter();
	context.moveTo(center.X(), center.Y());
	context.beginPath();
	context.arc(center.X(), center.Y(), this.getRadius(), 0, 2 * Math.PI, false);
	context.closePath();
	context.fill();
}